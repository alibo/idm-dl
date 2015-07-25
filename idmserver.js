var net = require('net');
var validUrl = require('valid-url');

var options = {
	host: '127.0.0.1',
	port: 2323,
	path: 'C:\\Program Files\\idm\\idman.exe'
};

/**
 * constructor for Idm Server
 * 
 * @param {object}
 */
function IdmServer(_options){

	if(!_options){
		this.options = options;
		return;
	}

	this.options = {};

	this.options.host = _options.host ? _options.host : options.host;
	this.options.port = _options.port ? _options.port : options.port;
	this.options.path = _options.path ? _options.path : options.path;

}

/**
 * start server
 * 
 * @return void
 */
IdmServer.prototype.start = function(callback){

	var self = this;

	this.server = net.createServer(function(connection){

		connection.on('end', function(){
			console.log('disconnected!');
		});

		connection.on('data', function(data){
			console.log('received data: %s', data);

			if(!self._isValid(data)){
				console.log("Data is not valid!");
				return;
			}

			var jsonData = JSON.parse(data);

			var url = jsonData.url.trim();
			var action = jsonData.action.trim();

			console.log("adding url: %s to idm with action: %s", url, action);

		});

	});

	var self = this;

	this.server.listen(this.options.port, this.options.host, null, function(){
		console.log("Server is listening on port: %d", self.options.port);
		callback();
	});
};

IdmServer.prototype._isValid = function(data){
	try{
		jsonData = JSON.parse(data);

		if(!jsonData.url || !jsonData.action){
			throw new Error("Invalid Json");
		}

	}catch(e){
		console.log('json is not valid!');
		return false;
	}

	if(!validUrl.isUri(jsonData.url.trim())){
		console.log('url is not valid!');
		return false;
	}

	return true;
};


module.exports = IdmServer;