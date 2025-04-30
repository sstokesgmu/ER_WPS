---@class Player

DataCollector = {}
function DataCollector.new()
    local self = setmetatable({}, { __index = DataCollector })
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

function DataCollector.distanceBetween(pos1, pos2)
    local px,py,pz = table.unpack(pos1)
    local nx,ny,nz = table.unpack(pos2)
    return math.sqrt((px-nx)*(px-nx)+(py-ny)*(py-ny)+(pz-nz)*(pz-nz))
end


function DataCollector:TraverseNPCTable(WorldChrMan)
    -- local p = readQword(WorldChrMan)
    -- if not p then return end

    -- local begin = readQword(p + 0x1F1B8)
    -- if not begin then return end

    -- local px, py, pz = self:GetPlayerPosition()
    -- if not px or not py or not pz then return end

    --local count = self:GetCharacterCount(WorldChrMan)
    local result = {}


    print("This is where the player is at: ", locationKey)

    -- find possible npcs based on character location 
    local npcs = nil
    for k,v in pairs(self.NpcsInChunk) do
        if k == locationKey then
            print("Found npcs inside the chunk")
            npcs = v
            break
        end
    end
    if not npcs then return print("There are no npcs at this chunk", locationKey) end
    local paramID={1,20510000,3999,523220000,523210000,523160000,523240000}

    --[[
        npcs => {
            name_1 = {v1 ... vn},
            name_n = {v1 ... vn},
        }
    --]]

    --Because we will be inside the loop going through the of self:GetCharacterCount(WorldChrMan)
    --if not DepthSearch(paramID,npcs) then break end --go to the next interation 
    for _,v in ipairs(paramID) do
        local npcName = DepthSearch(v,npcs);
        if npcName then
            print("Param: " .. v .. " found in table")
            
            -- check if the animationNum is less than 1 if it is the the npc is not active and
            -- should not be counted in the npcsIns

            local npc = NPC.new(v,npcName,0x333333,12344,{9.21,10,20},10)
            print(table.concat(npc,','))
            local npcString = ""

            for k, field in pairs(npc) do
                npcString = npcString .. k .. ": " .. tostring(field) .. ", "
            end
            print(npcString)
            table.insert(self.npcsIns,npc)
        else print("Param: " .. v .. " not found in table")
        end
    end
    print(#self.npcsIns)
end

function DepthSearch(target,table)       
    --Base case 1 : the table is empty, stop recursion and return false 
    if not table then return false end

    --Base case 2: Search for the target => found return true
    for k, v in pairs(table) do
        if v == target then return true end

        -- Recursive Case: v is a table we need to go deeper 
        if type(v) == "table" then
            local found = DepthSearch(target,v) -- Jump into the nested table 
            --Base case 2: Found the target in the nested table 
            if found then
                return k
            end
        end
    end
end

local dataTable = DataCollector.new()
dataTable.playerIns.coords3D = {0, 0, 0} -- Example: Set player position

dataTable:TraverseNPCTable()        