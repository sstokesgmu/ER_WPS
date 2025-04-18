--Possibly inlcude types like We can create a
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

return Server
