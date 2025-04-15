print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

package.path = package.path ..
    ";/home/deck/.luarocks/share/lua/5.4/?.lua;/home/deck/Desktop/EldenRing_Hackathon/Server/lua_modules/share/lua/5.4/?.lua"
package.cpath = package.cpath ..
    ";/home/deck/.luarocks/lib/lua/5.4/?.so;/home/deck/Desktop/EldenRing_Hackathon/Server/lua_modules/lib/lua/5.4/?.so"

local socket = require("socket")
local SERVER = require "Server"
-- Server = { protocol = nil, ip = nil, portNumber = nil }

-- function Server.EstablishSocket(socket, address, port)
--     local udp = socket.udp()
--     --Server Settings
--     udp:settimeout(0);
--     udp:setsockname(address, port)
--     local ip, port = udp:getsockname()
--     return udp, ip, port
-- end

local udpServer = SERVER.new(socket, "*", 12345)
print(type(udpServer))
--Setup
print("Server is created,  ip: " .. udpServer.ip .. " and the port number: " .. udpServer.portNumber);
print("Is Running: " .. tostring(udpServer.running))

udpServer.running = true;
-- local running = true

-- --Check for clients
-- local clients = {}

-- --Main Server Loop
print("Beginning server loop")
while udpServer.running do
    -- Listen for request
    -- udpServer.protocol === udp
    local data, ip, port = udpServer.protocol:receivefrom()

    --New data


    --If data is received
    if data then
        print("Data recieved from ip: " .. ip)
        --Format the data then send the to the client map server
    else
        print("No data is recieved")
        socket.sleep(1);
    end
end
print
('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
