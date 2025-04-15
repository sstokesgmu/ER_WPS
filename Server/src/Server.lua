--Possibly inlcude types like We can create a
Server = {
    running    = false,
    protocol   = nil,
    ip         = nil,
    portNumber = nil,
}


local function initialiazeSocket(socket, address, port)
    local udp = socket.udp()
    --Set up Server Settings
    udp:settimeout(0)
    udp:setsockname(address, port)
    local ip, portNumber = udp:getsockname()
    return udp, ip, portNumber
end






--Instance
function Server.new(socket, address, port, running)
    local self = setmetatable({}, { __index = Server })
    --Immediately Invoked Function
    self.running = running
    self.protocol, self.ip, self.portNumber = initialiazeSocket(socket, address, port)
    return self
end

return Server
