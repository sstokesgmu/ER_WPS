print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

package.path = package.path ..
    ";/home/deck/.luarocks/share/lua/5.4/?.lua;/home/deck/Desktop/EldenRing_Hackathon/Server/lua_modules/share/lua/5.4/?.lua"
package.cpath = package.cpath ..
    ";/home/deck/.luarocks/lib/lua/5.4/?.so;/home/deck/Desktop/EldenRing_Hackathon/Server/lua_modules/lib/lua/5.4/?.so"

local socket = require("socket")
local cjson = require("cjson")
local SERVER = require("Server")

-- Listen on all available interface using Ipv4
local udpServer = SERVER.new(socket, "*", 12345)
print(type(udpServer))
--Setup
print("Server is created,  ip: " .. udpServer.ip .. " and the port number: " .. udpServer.portNumber);
print("Is Running: " .. tostring(udpServer.running))

udpServer.running = true;

-- --Main Server Loop
print("Beginning server loop")
while udpServer.running do
    -- Listen for request
    -- udpServer.protocol === udp
    local data, ip, port = udpServer.protocol:receivefrom()

    --New data
    -- Define the game data as a Lua table
    local gameData = {
        playerPos = { 10, 10, 3 },
        hp = 100,
        stamina = 100,
        mp = 10
    }

    --If data is received
    if data then
        print("Data recieved from ip: " .. ip)
        --Format the data then send the to the client map server
    elseif gameData then
        local json = cjson.encode(gameData)
        udpServer.protocol:sendto(json, '0.0.0.0', 56789);
        print("Sending data ...")
    else
        print("No data is recieved")
        socket.sleep(1);
    end
end
print
('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
