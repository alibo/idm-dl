var idmDl = require('./../index');

var server = new idmDl.Server({
	port: 4444,
	host: '127.0.0.1'
});

server.start(function(){
	console.log('server is started!');
});