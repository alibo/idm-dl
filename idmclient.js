var net = require('net');

var options = {
	host: '127.0.0.1',
	port: 4444
};

/**
 * Constructor for Idm Client
 * 
 * @param {object} options.host && object.port
 */
function IdmClient(_options){

	if(!_options){
		this.options = options;
		return;
	}

	this.options = {};

	this.options.host = _options.host ? _options.host : options.host;
	this.options.port = _options.port ? _options.port : options.port;
}

/**
 * Connect to server
 * 
 * @param  {Function}
 * @return {void}
 */
IdmClient.prototype.connect = function(callback){

	var self = this;

	this.client = net.connect({
		port: this.options.port,
		host: this.options.host
	},function(){
		console.log('Connected to server on %s:%d', self.options.host, self.options.port);
		callback();
	});

	//todo on close, emit event
	//todo on error, emit event

};

/**
 * Add url to IDM's main queue
 * 
 * @param  {string} url
 * @return {void}
 */
IdmClient.prototype.queue = function(url){

	var data = {
		url: url,
		action: 'queue'
	};

	this.client.write(JSON.stringify(data));
};

/**
 * push url to IDM to download instantly
 * 
 * @param  {string} url
 * @return {void}
 */
IdmClient.prototype.download = function(url){

	var data = {
		url: url,
		action: 'instant'
	};

	this.client.write(JSON.stringify(data));
};

module.exports = IdmClient;