const http = require('http');
const server = http.createServer();

server.listen(1337, function() {
	console.log('Listening patiently at port 1337')
})

server.on('request', function (request, response) {
	console.log('requestttt')
	response.end('goodbye')
})