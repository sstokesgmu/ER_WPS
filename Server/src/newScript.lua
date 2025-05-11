-----------------------------------------------
-- Goal: we need a script that can access the data from Cheat Engines address list and transfer that data to the node server
-- We first have a series of tables with predefined values Player, NPC, and World -> convert that to JSON -> then send that data out
--? OPLog
-----------------------------------------------
local socket = require("socket")
local JSON = require("lunajson")

print(
    "-----------------------------------------------------------------------------------------------------------------------------------------------------------------------")

------------------------------------------------------------------------------------------------
-- Timer





------------------------------------------------------------------------------------------------
-- Example: Listening on the local IP address 192.168.1.10 and targetting the same address.

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
    return self
end

Player = {}
function Player.new(coords2D, coords3D, baseStats, attributes, resistances, armor)
    local self = setmetatable({}, { __index = Player })
    self.coords2D = coords2D
    self.coords3D = coords3D
    self.baseStats = baseStats
    self.attributeStats = attributes
    self.ResStats = resistances
    self.armor = armor
    return self
end

NPC = {}
function NPC.new(id, name, address, anim, coords, dist)
    local self = setmetatable({}, { __index = NPC })
    self.paramId = id
    self.name = name
    self.address = address
    self.animationNum = anim
    self.coords = coords
    self.distToPlayer = dist
    return self
end

DataCollector = {}
function DataCollector.new()
    local self = setmetatable({}, { __index = DataCollector })
    self.WorldChrMan = (function()
        print("immediately invoked function")
        local addr = AOBScanModuleUnique("eldenring.exe", "0F 10 00 0F 11 44 24 70 0F 10 48 10 0F 11 4D 80 48 83 3D",
            "+X")
        if addr then
            print("Found address")
            return addr + 24 + readInteger(addr + 19, true)
        else
            print("Address is null")
        end
    end)()
    self.playerIns = nil
    self.npcsIns = {}
    self.playerData = {
        { 'X_POS',        'Y_POS' },
        { 'HP_Fetch',     'MP_Fetch',    'STM', },
        { 'VGR',          'MND',         'END',            'STR',           'DEX', 'INT_Fetch', 'FTH', 'ARC' },
        { 'IMMUNITY',     'ROBUSTNESS',  'VITALITY',       'FOCUS' },
        { 'Helmet_Fetch', 'Armor_Fetch', 'Gauntlet_Fetch', 'Leggings_Fetch' }
    }
    self.LocationOrigins = {
        Round_Table = { -21, -305, 0 },
        Leyndell = { 400, 400, 0 },
        Limgrave = { 200, 200, 0 },
        Caelid = { 10, 10, 0 },
        Liurnia = { 100, 100, 0 }
    }
    self.NpcsInChunk = {
        Round_Table = {
            Gideon = { 523240000, 523240070, 523240079, 523240179 },
            Corhyn = { 523510000, 523510030, 523510034, 523510050, 523510070, 523510079, 523510130, 523510170 },
            Diallos = { 523140000, 523140020, 523140020, 523140079, 523140120, 523140179, 523140220 },
            Roderika = { 523200079, 523200179, 523200279 }, --Roderika + Spirit Tuner
            D = { 523190000, 523190010, 523190065, 523190066, 523190079, 523190110, 523190179 },
            Hewg = {},
            Fia = { 523220000, 523220066, 523220079, 523220166, 523220179, 523220266, 523220366 },
            Nepheli = { 523340000, 523340014, 523340020, 523340079, 523340114, 523340120, 523340179, 523340214 },
            Rogier = { 523250000, 523250014, 523250050, 523250066, 523250079, 523250114, 523250166, 523250214 },
            Enia = {},
            Ensha = { 523390000, 523390079 },
            Maiden_Husk = { 500020079 },
            Dung = { 523230000, 523230020, 523230033, 523230035, 523230079, 523230135, 523230179, 523230279 }
        },
        Limgrave = {
            Melina     = { 21800000, 21801000, 21801034, 21803000, 21809000 },
            Boc        = {},
            S_Sellen   = { 523160000, 523160010, 523160010, 523160020, 523160020, 523160020 },
            Blaidd     = { 20100000, 20101000, 20107500, 20108000, 20109000, 20109010, 20109020, 20109040, 20109064, 20109110, 20109120, 20109140, 20109210, 20109240, 20109310, 20109410 },
            N_Merchant = {},
            E_Merchant = {},
            W_Merchant = {},
            Yura       = { 523180000, 523180010, 523180020, 523180030, 523180050, 523180079, 523180110, 523180130, 523180210, 523180210, 523180210 },
            Kenneth    = { 523210000, 523210010, 523210014, 523210110 },
            Alexander  = {},
            -- Enia = {},
            Roderika   = { 523200079, 523200179, 523200279 }, --Roderika + Spirit Tuner
            D          = { 523190000, 523190010, 523190065, 523190066, 523190079, 523190110, 523190179 },
            Ranni      = { 20500000, 20500010, 20500020, 20500100, 20500122, 20500178, 20501000, 20501022, 20501100, 20501122, 20510000 },
            Bernahl    = { 523260000, 523260010, 523260038 },
            Rogier     = { 523250000, 523250014, 523250050, 523250066, 523250079, 523250114, 523250166, 523250214 },
            Patches    = { 523090000, 523090010, 523090020, 523090030, 523090032, 523090038, 523090110, 523090132, 523090210, 523090310, 523090410, 533090000, 533090040, },
            Nepheli    = { 523340000, 523340014, 523340020, 523340079, 523340114, 523340120, 523340179, 523340214 }

        },
        Caelid = {},
    }
    -- Additional setup code like finding player, location, etc.
    return self
end

StateMachine = {}
function StateMachine.new(datacollector)
    local self = setmetatable({}, { __index = StateMachine })
    self.collector = datacollector
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
        INITIAL = function()
            print("Starting System ...")
            print("Starting first call ...")
            local playerdata = self.collector.buildTablefromAddressList(self.collector.playerData, 1, 5)
            if playerdata == nil then error("Player data returned nil") end
            local coords2D, baseStats, attributes, resistances, armor = table.unpack(playerdata)
            print(coords2D)
            local coords3D = self.collector:GetPlayerPosition()

            self.collector.playerIns = Player.new(coords2D, coords3D, baseStats, attributes, resistances, armor)

            if self.collector.playerIns then print("created a player instance", JSON.encode(self.collector.playerIns)) end

            print("WorldChrMan is: ", self.collector.WorldChrMan)
            local npcData = self.collector:TraverseNPCTable(self.collector.WorldChrMan)


            if npcData then print("NPCs found: ", JSON.encode(npcData)) else print("npc data is null") end
            self.next = "RUNNING";
            print("State machine ", self.next)
        end,
        RUNNING = function()
            print("In Running Mode");

            local playerdata = self.collector.buildTablefromAddressList(self.collector.playerData, 1, 1)
            if playerdata == nil then error("Player data returned nil") end
            self.next = "CLOSE"
        end,
        CLOSE = function()
            print("Closing Server")
            self.current = nil
            self.next = nil
            stopMonitoring()
        end
    }
    return self
end

-- Example: Listening on the local IP address 192.168.1.10 and targetting the same address.
local udpServer = Server.new(socket, '192.168.1.10', 4000, "192.168.1.10")
local DATACOLLECTOR = DataCollector.new()
local stateMachine = StateMachine.new(DATACOLLECTOR)
local timer = nil
------------------------------------------------------------------------------------------------
-- STATE MACHINE




------------------------------------------------------------------------------------------------


function StateMachine:executeState() self.actions[self.current]() end

-- function StateMachine:changeState()
--     if self.States[newState] then
--         self.currentState = newState
--     else
--         print("Invalid State: ", newState)
--     end
-- end

------------------------------------------------------------------------------------------------
--Data Collector Class




------------------------------------------------------------------------------------------------

function DataCollector.buildTablefromAddressList(list, start, limit)
    print("Fetching values from address table")
    if limit < start then
        limit = start + 1
    elseif limit > #list then
        limit = #list - 1
    end


    local retrieveTable = {}
    for k, v in ipairs(list) do
        if k > limit then
            print("Finished at", k, v)
            break -- Optionally stop after exceeding the limit
        end
        local blankT = {}
        DepthExecute(v, function(arg)
            local value = getAddressList().getMemoryRecordByDescription(arg).Value
            table.insert(blankT, value)
        end)
        table.insert(retrieveTable, blankT)
    end

    return retrieveTable
end

function DepthExecute(table, callback)
    -- Base Case the table is empty exit recursion loop
    if not table then return false end
    -- the value is a table get the values move them up
    for _, v in pairs(table) do
        if type(v) == "table" then
            print(v)
            DepthExecute(v, callback)
        else
            callback(v)
        end
    end
end

function DepthSearch(target, table)
    --Base case 1 : the table is empty, stop recursion and return false
    if not table then return false end

    --Base case 2: Search for the target => found return true
    for k, v in pairs(table) do
        if v == target then return true end
        -- Recursive Case: v is a table we need to go deeper
        if type(v) == "table" then
            local found = DepthSearch(target, v) -- Jump into the nested table
            --Base case 2: Found the target in the nested table
            if found then
                return k
            end
        end
    end
end

function DataCollector:GetPlayerPosAddr()
    local pointer = readQword(self.WorldChrMan) -- Access self.WorldChrMan
    if not pointer then return end
    pointer = readQword(pointer + 0x1E508)
    if not pointer then return end
    pointer = readQword(pointer + 0x190)
    if not pointer then return end
    pointer = readQword(pointer + 0x68)
    if not pointer then return end
    return pointer
end

function DataCollector:GetPlayerPosition(asbytes)
    local p = self:GetPlayerPosAddr()
    if not p then return end
    if asbytes then return readBytes(p + 0x70, 12, true) end
    return { readFloat(p + 0x70), readFloat(p + 0x74), readFloat(p + 0x78) }
end

function DataCollector:GetCharacterCount(WorldChrMan)
    local pointer = readQword(WorldChrMan)
    if not pointer then return 0 end
    local begin = readQword(pointer + 0x1f1B8) --:
    local finish = readQword(pointer + 0x1F1C0)
    if not begin or not finish or begin >= finish then return 0 end
    return (finish - begin) / 8
end

function DataCollector.distanceBetween(pos1, pos2)
    if not (pos1 and pos2) then return error("One of the positions is missing") end
    if (#pos1 + #pos2) == 6 then
        print("Three D")
        -- Dealing with a 3D system
        local px, py, pz = table.unpack(pos1)
        local ex, ey, ez = table.unpack(pos2)
        return math.sqrt((px - ex) * (px - ex) + (py - ey) * (py - ey) + (pz - ez) * (pz - ez))
    else
        -- Dealing with a 2D system
        local px, py = table.unpack(pos1)
        local ex, ey = table.unpack(pos2)
        return math.sqrt((px - ex) * (px - ex) + (py - ey) * (py - ey))
    end
end

function DataCollector:FindChunk()
    local minDistance = math.huge
    local targetKey = nil
    for k, v in pairs(self.LocationOrigins) do
        print(k, v);
        if not self.playerIns.coords3D then
            print("Player instance or player coordinates are not found")
            break
        end
        local dist = self.distanceBetween(self.playerIns.coords2D, v)
        if dist < minDistance then
            minDistance = dist
            targetKey = k
        end
    end
    return targetKey
end

function DataCollector:TraverseNPCTable(WorldChrMan)
    print("Received WorldChrMan:", WorldChrMan)
    print("Self WorldChrMan:", self.WorldChrMan)
    print("Are they equal?", WorldChrMan == self.WorldChrMan)
    if not WorldChrMan then print("WorldChrMan is null") end
    local p = readQword(WorldChrMan)
    if not p then return end

    local begin = readQword(p + 0x1F1B8)
    if not begin then return end

    local px, py, pz = table.unpack(self.playerIns.coords3D)
    if not px or not py or not pz then return end

    print("Find the player Chunk")
    local locationKey = self:FindChunk() --This can be stored in world data
    print("This is where the player is at: ", locationKey)

    -- find possible npcs based on character location
    local npcs = nil
    for k, v in pairs(self.NpcsInChunk) do
        if k == locationKey then
            npcs = v
            break
        end
    end
    if not npcs then return print("There are no npcs at this chunk", locationKey) end

    local count = self:GetCharacterCount(WorldChrMan)
    local result = {}
    print("current npc count ", count)
    for i = 0, count-1 do
        print("I is: ", i)
        local p = readQword(begin + i * 8)
        if p and p >= 65536 then
            local x=readInteger(p+8)
            x=readSmallInteger(p+0x74)
            x=readInteger(p+0x60, true) --Param ID
            print("The Param ID is", x)
            x=readByte(p+0x6C) --108
            p=readQword(p+0x190) -- 400 and changing the address of p
            -- p = readQword(p+0x1FC)
            -- print("Data at value: ", p) -- p = readQword(p+0x1FC)
            x=readQword(p) -- value at p -- include this
            x=readQword(x+0x138) -- 312
            x=readQword(p+0x18) -- 24
            x=readInteger(x+0x40,true) -- Animation id --64 --x = (p+0x190)
            print("Animation ID is", x)

            p=readQword(p+0x68)
            print("Data at value: ", p)
            x=readFloat(p+0x70)
            print("Data at value: ", x)
        end
    end
    return result
end

function startMonitoring()
    --Create Server and StateMachine
    if timer ~= nil then -- we already create the timer no need to make another one
        print(" Timer was already created ")
        return
    end
    print("creating Timer")

    -- Crate an instance of timer
    timer = createTimer(getMainForm());
    if not timer then
        print("Failed to create timer!")
    else
        print("Timer created successfully!")
    end
    timer.Interval = 2000;
    udpServer.running = true;
    print("Inside start monitoring no error yet messing with the timer and server instance")
    timer.OnTimer = function(sender)
        local success, error = pcall(
            function()
                -- call the current state methods
                local result = stateMachine.actions[stateMachine.current]();
                if not timer then return end -- exit the loop when the State Machine is closing

                if result then print("The state machine return successfully on current state: " .. stateMachine.current) end
                -- local data = JSON.encode(result);
                -- --nil check? why
                -- --udpServer.protocol:sendto(data, udpServer.targetip, udpServer.portNumber)
                -- --Print a log
                -- print("Successfully sent data to: ", udpServer.targetip, "  with a  state of: ",
                --     StateMachine.currentState)
                -- Listen for server call or input from the use
                if stateMachine.next ~= nil then
                    print("StateMachine does not equal null")

                    --Then there was a state change

                    stateMachine.current = stateMachine.next;
                end
            end)
        if not success then
            print("Error occurred: ", error)
            stopMonitoring()
        end
    end
end

function stopMonitoring()
    --There is no timer to destroy
    if timer == nil then return end
    print("Closed program")
    -- return nil
    timer.destroy() --cleanup
    timer = nil
    print(
        "-----------------------------------------------------------------------------------------------------------------------------------------------------------------------")
end

-- This is definately not the right numbers
startMonitoring()
