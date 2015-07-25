var net = require('net');
var validUrl = require('valid-url');
var exec = require('child_process').exec;
var util = require('util');

var options = {
	host: '0.0.0.0',
	port: 4444,
	path: 'C:\\Program Files\\Internet Download Manager\\IDMan.exe'
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
			self._sendToIdm(url, action);
			//todo send feedback to client
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

IdmServer.prototype._sendToIdm = function(url, action){

	var instantCommand = '%s /n /d "%s"'
	var queueCommand = instantCommand + ' /a';

	var cmd = (action == 'queue') ? queueCommand : instantCommand;

	cmd = util.format(cmd, this.options.path, url);

	exec(cmd, function(error, stdout, stderr) {
		if(!error){
			console.log('Success! - ' + stdout);
		}else{
			console.error('Error: ' + error);
		}
	});

};


module.exports = IdmServer;