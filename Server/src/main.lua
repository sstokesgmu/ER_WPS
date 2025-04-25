print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')

package.path = package.path ..
    ";/home/deck/.luarocks/share/lua/5.4/?.lua;/home/deck/Desktop/EldenRing_Hackathon/Server/lua_modules/share/lua/5.4/?.lua"
package.cpath = package.cpath ..
    ";/home/deck/.luarocks/lib/lua/5.4/?.so;/home/deck/Desktop/EldenRing_Hackathon/Server/lua_modules/lib/lua/5.4/?.so"
local socket = require("socket")
local JSON = require("lunajson")
-- local SERVER = require("Server")

Server = {
    running    = false,
    protocol   = nil,
    ip         = nil,
    portNumber = nil,
    targetip   = nil,
}


local function initialiazeSocket(socket, serverAddress, port)
    local udp = socket.udp()
    --Set up Server Settings
    udp:settimeout(0)
    udp:setsockname(serverAddress, port)
    local ip, portNumber = udp:getsockname()
    return udp, ip, portNumber
end

--Instance
function Server.new(socket, serverAddress, port, targetAddress, running)
    local self = setmetatable({}, { __index = Server })
    self.running = running
    self.targetip = targetAddress
    self.protocol, self.ip, self.portNumber = initialiazeSocket(socket, serverAddress, port)
    return self
end
-- Listen on all available interface using Ipv4
local udpServer = Server.new(socket, "*", 4000, "192.168.1.160")
print(type(udpServer))
--Setup
print("Server is created,  ip: " .. udpServer.ip .. " and the port number: " .. udpServer.portNumber);
print("Targeting ip address: " .. udpServer.targetip)
print("Is Running: " .. tostring(udpServer.running))
print("-----------------------------------------------------------------------------------------")
udpServer.running = true;
--Main Server Loop
print("Beginning server loop")
while udpServer.running do
    -- Listen for request
    -- udpServer.protocol === udp
    local data, ip, port = udpServer.protocol:receivefrom()
    --New datas (template)
    data = {
        playerPos = { 10, 10, 3 },
    }

    --Check the format instead of if the data is recieved
    --If data is received
    if data then
        --Format the data then send the to the client map server
<<<<<<< HEAD
        local json = JSON.encode(data)
        -- udpServer.protocol:sendto(json, udpServer.targetip, udpServer.portNumber);
        print("Sending data to " .. udpServer.targetip .. ":" .. udpServer.portNumber)
=======
        local json = cjson.encode(data)
        print(json)
        -- udpServer.protocol:sendto(json, udpServer.targetip, udpServer.portNumber);
        -- print("Sending data to " .. udpServer.targetip .. ":" .. udpServer.portNumber)
>>>>>>> 65095f7d7c60828ba60db0c5ac392831c14bdbce
    else
        print("No data is recieved")
        socket.sleep(1);
    end
end
print
('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
