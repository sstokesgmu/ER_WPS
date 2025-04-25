[ENABLE]
//code from here to '[DISABLE]' will be used to enable the cheat



{$lua}

local PlayerData = {
    pos =  {'X_POS', 'Y_POS'}
}

local WorldData = {

}

local NPCData = {

}


function fetchPropNames(list, start, limit)
         if limit < start or limit > #list then
           --print("limit is less than start, setting limit = start + 1")
           limit = start + 1
         end

         local nameTable = {}

         for i = start, #list do
             if i == limit then return nameTable end
             for v in ipairs(list[i]) do
                 nameTable[#nameTable + 1] = list[i][v]
             end
         end
         return nameTable
end

function fetchValueByName(list)
    local res = {}
    local addressList = getAddressList()
    for k in ipairs(list) do
        local memoryRecord = addressList.getMemoryRecordByDescription(list[k])
        res[#res + 1] = memoryRecord.Value
    end
    return res
end

function convertJSON(table)
{
    local json = cjson.encode(data)
}

print("Initialize function find player pos")
local result = fetchValueByName(fetchPropNames(PlayerData,1,3))
print(table.concat(result, " "))



[DISABLE]
//code from here till the end of the code will be used to disable the cheat
