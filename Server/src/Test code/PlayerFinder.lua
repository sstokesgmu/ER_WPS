

--stateMachine.actions[stateMachine.current]()

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
        INITIAL = function()
            print("Starting System")
            print("Starting first call")
            local playerdata = DATACOLLECTOR.buildTablefromAddressList(DATACOLLECTOR.playerData,1,2);
            -- Print the result of retrieveTable
            print("Contents of retrieveTable:")
            -- What does playerdata look like?
            print(#playerdata)

            -- Print the length of the playerdata table
            print("Length of playerdata:", #playerdata)

        -- Print the content of each sub-table in playerdata
        for i, subTable in ipairs(playerdata) do
            print("Sub-table " .. i .. ":")
            for _, value in ipairs(subTable) do
                print(value)
            end
        end

        end, --fullread --After this change the state to Running on success
        RUNNING,
        CLOSE = function()
            print("Closing Server")
        end
    }
    return self
end

function StateMachine:callStateFunctions() self.actions[self.current]() end

function StateMachine:changeState()
    if self.States[newState] then
        self.currentState = newState
    else
        print("Invalid State: ", newState)
    end
end
Player = {}
function Player.new()
    local self = setmetatable({}, {__index = Player})
    self.coords2D = {}
    self.coords3D = {}
    self.baseStats = {}
    self.AddStats = {}
    self.BuildStatus = {}
    return self
end

NPC = {}
function NPC.new(id,name,address,anim,coords,dist)
    local self = setmetatable({},{__index = NPC})
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
    -- self.WorldChrMan = (function()
    --     local addr = AOBScanModuleUnique("eldenring.exe", "0f 10 00 0F 11 24 70 0F 10 48 10 0F 11 4D 80 48 83 3D", "+X")
    --     if addr then return addr + 24 + readInteger(addr + 19, true) end
    --  end)()
    self.playerIns = Player.new()
    self.npcsIns = {}
    self.playerData = {
        { 'X_POS', 'Y_POS' },
        { 'Hp', 'Fp',   'Stm', 'Ep_Load', 'Ps',  'Mem' },
        { 'Vgr','Mnd','End', 'Str','Dsc', 'Int', 'Fth', 'Arc' },
    }
    self.LocationOrigins = {
        Round_Table = {0,0,0},
        Leyndell = { 400, 400,0 },
        Limgrave = { 200, 200, 0},
        Caelid = { 10, 10, 0},
        Liurnia = {100, 100, 0}
    }
    self.NpcsInChunk = {
        Round_Table = {
            Gideon = {523240000,523240070,523240079,523240179},
            Corhyn = {523510000,523510030,523510034,523510050,523510070,523510079,523510130,523510170},
            Diallos = {523140000,523140020,523140020,523140079,523140120,523140179,523140220},
            Roderika = {523200079,523200179,523200279}, --Roderika + Spirit Tuner
            D = {523190000,523190010,523190065,523190066,523190079,523190110,523190179},
            Hewg = {},
            Fia = {523220000,523220066,523220079,523220166,523220179,523220266,523220366},
            Nepheli = {523340000,523340014,523340020,523340079,523340114,523340120,523340179,523340214},
            Rogier = {523250000,523250014,523250050,523250066,523250079,523250114,523250166,523250214},
            Enia = {},
            Ensha = {523390000,523390079},
            Maiden_Husk = {500020079},
            Dung = {523230000,523230020,523230033,523230035,523230079,523230135,523230179,523230279}
        },
        Limgrave = {
            Melina = {21800000, 21801000, 21801034, 21803000,21809000},
            Boc = {},
            S_Sellen ={523160000,523160010,523160010,523160020,523160020,523160020},
            Blaidd = {20100000,20101000,20107500,20108000,20109000,20109010,20109020,20109040, 20109064, 20109110,20109120,20109140,20109210,20109240,20109310,20109410},
            N_Merchant = {},
            E_Merchant = {},
            W_Merchant = {},
            Yura = {523180000, 523180010,523180020,523180030,523180050,523180079,523180110,523180130,523180210,523180210,523180210},
            Kenneth = {523210000,523210010,523210014,523210110},
            Alexander = {},
            -- Enia = {},
            Roderika = {523200079,523200179,523200279}, --Roderika + Spirit Tuner
            D = {523190000,523190010,523190065,523190066,523190079,523190110,523190179},
            Ranni = {20500000,20500010,20500020,20500100,20500122,20500178,20501000,20501022,20501100,20501122,20510000},
            Bernahl = {523260000,523260010,523260038},
            Rogier = {523250000,523250014,523250050,523250066,523250079,523250114,523250166,523250214},
            Patches  = {523090000,523090010,523090020,523090030,523090032,523090038,523090110,523090132,523090210,523090310,523090410,533090000,533090040,},
            Nepheli = {523340000,523340014,523340020,523340079,523340114,523340120,523340179,523340214}

        },
        Caelid = {},
    }
    -- Additional setup code like finding player, location, etc.
    return self
end

-- 
function DataCollector.buildTablefromAddressList(list, start, limit)
    if limit < start then
        limit = start + 1
    elseif limit > #list then
        limit = #list - 1
    end
    local retrieveTable = {}
    for k, v in ipairs(list) do
        if k > limit then
            print("Finished at", k, v)
            break  -- Optionally stop after exceeding the limit
        end
       local blankT = {}
       DepthExecute(v, function(arg) table.insert(blankT, arg) end)
       table.insert(retrieveTable, blankT)
    end
    
    return retrieveTable
end

function DepthExecute(table, callback)
    -- Base Case the table is empty exit recursion loop
    if not table then return false end
    -- the value is a table get the values move them up 
    for _,v in pairs(table) do
        if type(v) == "table" then DepthExecute(v,callback)
        else callback(v)
        end
    end
end

DATACOLLECTOR = DataCollector.new()
local stateMachine = StateMachine.new()
print(stateMachine)
print(stateMachine.current)
stateMachine.actions[stateMachine.current]()