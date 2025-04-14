print('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
local socket = require("socket")

local server = assert(socket.bind("*", 12345))
local ip, port = server:getsockname()

print("Server running on " .. ip .. ':' .. port)




print
('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
