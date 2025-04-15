print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
local socket = require "socket"

Server = { protocol = nil, ip = nil, portNumber = nil }

function Server.EstablishSocket(socket, address, port)
    local udp = socket.udp()
    --Server Settings
    udp:settimeout(0);
    udp:setsockname(address, port)
    local ip, port = udp:getsockname()
    return udp, ip, port
end

local server = Server.EstablishSocket(socket, '*', 10180)
--Setup
print("Server is created,  ip: " .. server.ip .. " and the port number: " .. server.portNumber);



-- local running = true

-- --Check for clients
-- local clients = {}

-- --Main Server Loop
-- print("Beginning server loop")
-- while running do
--     -- Listen for request
--     local data, ip, port = udp:receivefrom()

--     --New data


--     --If data is received
--     if data then
--         print("Data recieved from ip: " .. ip)
--         --Format the data then send the to the client map server
--     else
--         print("No data is recieved")
--         socket.sleep(1);
--     end
-- end
print
('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
