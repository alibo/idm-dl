var idmDl = require('./../index');
var validUrl = require('valid-url');

var getopt = require('node-getopt').create([
	['q' , 'queue' , 'Add to main queue [optional]'],
	['u' , '='     , 'Url'],
	[''  , 'port'  , 'Server port'],
	[''  , 'host'  , 'Server address'],
	['h' , 'help'  , 'display this help']
]);

getopt.bindHelp()     // bind option 'help' to default action
var opt = getopt.parseSystem(); // parse command line

var arguments = opt.options;

if(!arguments.u){
	getopt.showHelp();
	process.exit();
}

var url = arguments.u;

if(!validUrl.isUri(url)){
	console.error('[error]: Url {%s} is not valid!', url);
	getopt.showHelp();

	process.exit();
}

var port = arguments.port ? arguments.port : 4444;
var host = arguments.host ? arguments.host : '127.0.0.1';
var shouldQueue = (arguments.q || arguments.queue) ? true : false;

var idmClient = new idmDl.Client({
	port: port,
	host: host
});

var token = process.argv[2];

idmClient.connect(function(){

	if(shouldQueue){
		idmClient.queue(url);
	}else{
		idmClient.download(url);
	}

	done();
});

function done() {
	console.log('Ok. We\'re done!');
	process.exit();
}