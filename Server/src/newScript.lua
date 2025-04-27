-----------------------------------------------
-- Goal: we need a script that can access the data from Cheat Engines address list and transfer that data to the node server
-- We first have a series of tables with predefined values Player, NPC, and World -> convert that to JSON -> then send that data out
--? OPLog
-----------------------------------------------
local socket = require("socket")
local JSON = require("lunajson")


------------------------------------------------------------------------------------------------
-- Timer
------------------------------------------------------------------------------------------------
-- This is definately not the right numbers
local udpServer = Server.new(socket, '*', 4000, "local")
local server = nil
local stateMachine = StateMachine.new()
local dataCollector = DataCollector.new()
local timer = nil

function startMonitoring()
    --Create Server and StateMachine
    if timer ~= nil then -- we already create the timer no need to make another one
        return
    end
    -- Crate an instance of timer
    timer = createTimer(getMainForm());
    timer.Interval = 100;
    udpServer.running = true;
    timer.OnTimer = function(sender)
        local success, error = pcall(
            function()
                -- Listen for server call or input from the use
                --Access State Machine
                local newState = stateMachine.next
                local result = stateMachine:setState(newState)
                local data = JSON.encode()
                --nil check? why
                --udpServer.protocol:sendto(data, udpServer.targetip, udpServer.portNumber)
                --Print a log
                print("Successfully sent data to: ", udpServer.targetip, "  with a  state of: ",
                    StateMachine.currentState)
            end
        )
        if not success then
            print("Error occurred: ", error)
        end
    end
end

function stopMonitoring()
    --There is no timer to destroy
    if timer == nil then return end
    timer.destroy() --cleanup
    timer = nil
    local newState = "CLOSE";
    local result = stateMachine:setState(newState)
    stateMachine = nil
    udpServer.protocol:close();
    print("Closed program")
end


-- Server Configuration and Creation
Server = {
    running = false,
    protocol = nil,
    ip = nil,
    portNumber = nil,
    targetip = nil
}

function Server.new(socket, serverAddress, port, targetAddress, running)
    local self = setmetatable({}, { __index = Server })
    self.running = running
    self.targetip = targetAddress
    -- Create a IIFE
    self.protocol, self.ip, self.portNumber = (function()
        local udp = socket.udp()
        udp:settimeout(1) -- Wait for async operations
        udp:setsockname(serverAddress, port)
        local ip, portNumber = udp:getsockname()
        return udp, ip, portNumber
    end)()
end

------------------------------------------------------------------------------------------------
-- STATE MACHINE 
------------------------------------------------------------------------------------------------
StateMachine = {}
function StateMachine.new()
    local self = setmetatable({}, { _index = StateMachine })
    self.current = "INITIAL"
    self.next = nil
    --https://github.com/iskolbin/lpriorityqueue
    --https://www.reddit.com/r/lua/comments/7d0rjc/how_to_approach_a_queue_in_lua_for_pathfinding/
    --https://gist.github.com/LukeMS/89dc587abd786f92d60886f4977b1953
    self.queue = {}
    self.States = {
        OPEN = 1,
        RUNNING = 2,
        PAUSED = 3,
        CLOSE = 4
    }
    --Actions based on each STATE
    self.actions = {
        -- INITIAL = function()
        --            print("Initializing system...")
        --            -- Fetch initial game data, set up initial connections, etc.
        --        end,
        INITIAL = function ()
            print("Starting System")
            print("Starting first call")
            local playerProps = buildPropTable(PlayerData, 1, #PlayerData)
            local NpcProps = dataCollector.
        end, --fullread --After this change the state to Running on success
        RUNNING,
        CLOSE
    }
    return self
end

--function StateMachine:changeState(newState)

function StateMachine:setState(newState)
    --Was there a state change
    if newState == self.currentState then return end
    -- Is this a valid state
    if self.States[newState] then
        self.currentState = newState
    else
        print("Invalid State: ", newState)
    end
end


------------------------------------------------------------------------------------------------
--Data Collector Class 
------------------------------------------------------------------------------------------------
DataCollector = {}
function DataCollector.new()
    local self = setmetatable({}, {__index = DataCollector})
    self.playerData = nil
    self.NpcData = nil

    -- Additional setup code like finding player, location, etc.
    return self
end

-- DATA Retrieval
local PlayerData = {
    { 'X_POS', 'Y_POS' },
    { 'Hp',    'Fp',   'Stm', 'Ep_Load', 'Ps',  'Mem' },
    { 'Vgr',   'Mnd',  'End', 'Str',     'Dsc', 'Int', 'Fth', 'Arc' },
    -- Add Status
}

local NPC_Lim_Data = {
    Melina = {21800000, 21801000, 21801034, 21803000, 21809000},
    Boc = {},
    S_Sellen = {523160000, 523160010, 523160010, 523160020, 523160020, 523160020},
    Blaidd = {20100000,20101000,20107500,20108000,20109000,20109010,20109020,20109040,20109064,20109110,20109120,20109140,20109210,20109240,20109310,20109410},
}

-- World Origins
local worldOrigin = {
    Leyndell = { 400, 400 },
    Limgrave = { 200, 200 },
    Caelid = { 10, 10 }
}

-- NPC Functions 
function DataCollector:buildPropTable(table, start, limit)
    if limit < start then
        limit = start + 1
    elseif limit > #table then
        limit = #table - 1
    end
    local retrieveTable = {}

    -- Not inclusive
    for i = start, #table do
        if i == limit then return retrieveTable end
        for _, v in ipairs(table[i]) do
            table.insert(retrieveTable, v)
        end
    end
    return retrieveTable
end

function DataCollector:fetchValueByNames(table)
    local result = {}
    local addressList = getAddressList()
    for _, k in ipairs(table) do
        local memRecord = addressList.getMemoryRecordByDescription(k)
        result[#result + 1] = memRecord.value
    end
    return result
end

function DataCollector:ReturnNearPOI() 
    local addr = AOBScanModuleUnique("eldenring.exe", "0f 10 00 0F 11 24 70 0F 10 48 10 0F 11 4D 80 48 83 3D", "+X")
    local WorldChrMan
    if addr then 
        WorldChrMan = addr + 24 + readInteger(addr + 19, true)
    end
    return self:TraverseNPCTable(WorldChrMan)
end 

function DataCollector:GetCharacterCount(WorldChrMan)
    local pointer = readQword(WorldChrMan)
    if not pointer then return 0 end 
    local begin = readQword(pointer + 0x1f1B8)
    local finish = readQword(pointer + 0x1F1C0)
    if not begin or not finish or begin >= finish then return 0 end 
    return (finish - begin) / 8
end

function DataCollector:GetPlayerPosAddr(WorldChrMan)
    local pointer = readQword(WorldChrMan)
    if not pointer then return end 
    pointer = readQword(pointer + 0x1E508)
    if not pointer then return end 
    pointer = readQword(pointer + 0x190)
    if not pointer then return end 
    pointer = readQword(pointer + 0x68)
    if not pointer then return end 
    return pointer 
end 

function DataCollector:TraverseNPCTable(WorldChrMan)
    local p = readQword(WorldChrMan)
    if not p then return end 
    local begin = readQword(p + 0x1F1B8)
    if not begin then return end 
    local px, py, pz = self:GetPlayerPosition()
    if not px or not py or not pz then return end 
    local count = self:GetCharacterCount(WorldChrMan)
    local result = {}
    for i = 0, count - 1 do
        local npcPtr = readQword(begin + i * 8)
        if npcPtr and npcPtr >= 65536 then
            print(string.format("Found NPC at memory address: %X", npcPtr))
            table.insert(result, npcPtr)
        end
    end
    return result
end



