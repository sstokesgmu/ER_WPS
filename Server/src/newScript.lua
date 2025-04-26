-----------------------------------------------
-- Goal: we need a script that can access the data from Cheat Engines address list and transfer that data to the node server
-- We first have a series of tables with predefined values Player, NPC, and World -> convert that to JSON -> then send that data out



--? OPLog
-----------------------------------------------
local socket = require("socket")
local JSON = require("lunajson")



-- DATA Retrieval
local PlayerData = {
    { 'X_POS', 'Y_POS' },
    { 'Hp',    'Fp',   'Stm', 'Ep_Load', 'Ps',  'Mem' },
    { 'Vgr',   'Mnd',  'End', 'Str',     'Dsc', 'Int', 'Fth', 'Arc' },
    --Add Status
}
local NPCData = {
    DHunter = { 29, 39 },
    Blaid = { 400, 399 },
    Melina = { 80, 200 }
}

local worldOrigin = {
    Leyndell = { 400, 400 },
    Limgrave = { 200, 200 },
    Caelid = { 10, 10 }
}

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

-- STATE MACHINE

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
        INITIAL, --fullread --After this change the state to Running on success
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

-- FETCH DATA FROM CE'S ADDRESS TABLE
function buildPropTable(table, start, limit)
    if limit < start then
        limit = start + 1
    elseif limit > #table then
        limit = #table - 1
    end
    local retriveTable = nil;

    --Not inclusive
    for i = start, #table do
        if i == limit then return retriveTable end
        for v in ipairs(table[i]) do
            retriveTable[#retriveTable + 1] = table[i][v]
        end
    end
end

function fetchValueByNames(table)
    local result = {}
    local addressList = getAddressList()
    for k in ipairs(table) do
        local memRecord = addressList.getMemoryReocrdByDescription();
        result[#result + 1] = memRecord.value;
    end
end

-- TIMER

-- This is definately not the right numbers
local udpServer = Server.new(socket, '*', 4000, "local")
local server = nil
local stateMachine = StateMachine.new()
local timer = nil
--
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
                udpServer.protocol:sendto(data, udpServer.targetip, udpServer.portNumber)
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
