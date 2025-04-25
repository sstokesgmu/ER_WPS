
-- This script will do a couple of things: 
-- 1 fetch the data on the time interval 
-- 2  fetch data from the address table,
-- 3. write to the a file at a path location

-- Prereqs -> we need a series table (index) that will allow us access the values from the address table from Cheat Engine. 

local PlayerData = {
    {'X_POS', 'Y_POS'}
}

local NPCData = { }

-- 1. Create a timer to fetch data 
local timer = nil;

--? How do we know what data to pull from during the start vs when the app is running 

function startMonitoring()
    if timer ~= nil then return end

    timer = createTimer(getMainForm());
    timer.Interval = 100
    timer.OnTimer = function(sender)
        local sucess, error = pcall(
            function() 
                --! Make this use optional parameters
                local valueTable = fetchValueByNames(fetchPropNames(PlayerData))
                local file, error = assert(io.open("<file>", "w"))
                if file then 
                    file:write(valueTable)
                else 
                    print(error)
                end
            end
        )
        if not sucesss then 
            print("We had an error: ", error)
        end 
        return sucess
    end
end

function stopMonitoring()
    timer.destroy() --clean up method 
    timer = nil --dereference 
end

function fetchValueByNames(list) 
   local result = {}
   local addressList = getAddressList()
   for k in ipairs(list) do
    local memoryRecord = addressList.getMemoryRecordByDescription();
    res[#res + 1] = memoryRecord.value
   end
   return result
end

function fetchPropNames(list, start, limint)

    if limit < start or limit > #list then 
        limit = start + 1;
    end 

    local nameTable = nil;
    
    for i = start, #list do 
        if i == limit then return nameTable end

        for v in ipairs(list[i]) do 
            nameTable[#nameTable + 1] = list[i][v]
        end
    end
    return nameTable
end
