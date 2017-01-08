'use strict';
// -- Module Dependencies -- 
// -------------------
var express     = require('express');
var http        = require('http');
var JWT         = require('./lib/jwtDecoder');
var path        = require('path');
var request     = require('request');
var config      = require('./config/default');
var parseString = require('xml2js').parseString;
var fs = require('fs');

var configjson  = require('./public/ixn/activities/generic-activity/config.json');

// JB wants to be able to hit an index.html page ... just use this text to satisfy that request
var indexhtml = "Placeholder for JB";

function convertNumberToInteger(val) {
    if (isNaN(val)) {
        return val;
    } else {
        return parseInt(val);
    }
}

var app = express();

// Register configs for the environments where the app functions
// , these can be stored in a separate file using a module like config


var APIKeys = config;
// Simple custom middleware
function tokenFromJWT( req, res, next ) {
    // Setup the signature for decoding the JWT
    var jwt = new JWT({appSignature: APIKeys.appSignature});
    
    // Object representing the data in the JWT
    var jwtData = jwt.decode( req );

    // Bolt the data we need to make this call onto the session.
    // Since the UI for this app is only used as a management console,
    // we can get away with this. Otherwise, you should use a
    // persistent storage system and manage tokens properly with
    // node-fuel
    req.session.token = jwtData.token;
    next();
}

// Use the cookie-based session  middleware
app.use(express.cookieParser());

// TODO: MaxAge for cookie based on token exp?
app.use(express.cookieSession({secret: "CustomActivity-CookieSecret"}));

// Configure Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.favicon());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/ixn/activities/generic-activity/images/icon.png', function (req, res) {
    var caImg40 = 'CA_IMG_40';
    var imgLoc = process.env[caImg40];
    res.redirect(302, imgLoc);
});

app.get('/ixn/activities/generic-activity/images/iconSmall.png', function (req, res) {
    var caImg40 = 'CA_IMG_15';
    var imgLoc = process.env[caImg15];
    res.redirect(302, imgLoc);
});

//replace template values with environment variables.
app.get( '/ixn/activities/generic-activity/config.json', function( req, res ) {
	var actKey = 'KEY';
    var appName = 'APP_NAME';
	var actName = 'ACTIVITY_NAME';
	var actDesc = 'ACTIVITY_DESCRIPTION';
    var endpointName = 'ENDPOINT_NAME';
    var editHeight = 'EDIT_HEIGHT';
    var editWidth = 'EDIT_WIDTH';
    var endPointSearch = new RegExp('{{'+endpointName+'}}', 'g'); 
    var search = new RegExp('{{'+appName+'}}', 'g');
	var json = JSON.parse(JSON.stringify(configjson)); //clone it.
	json.arguments.execute.url = configjson.arguments.execute.url.replace(endPointSearch,process.env[endpointName]);
	json.configurationArguments.save.url = configjson.configurationArguments.save.url.replace(endPointSearch,process.env[endpointName]);
	json.configurationArguments.publish.url = configjson.configurationArguments.publish.url.replace(endPointSearch,process.env[endpointName]);
	json.configurationArguments.validate.url = configjson.configurationArguments.validate.url.replace(endPointSearch,process.env[endpointName]);
	json.edit.url = configjson.edit.url.replace(search,process.env[appName]);
	search = new RegExp('{{'+actKey+'}}', 'g');
	json.configurationArguments.applicationExtensionKey = configjson.configurationArguments.applicationExtensionKey.replace(search,process.env[actKey]);
	search = new RegExp('{{'+actName+'}}', 'g');
	json.lang['en-US'].name = configjson.lang['en-US'].name.replace(search,process.env[actName]);	
	search = new RegExp('{{'+actDesc+'}}', 'g');
	json.lang['en-US'].description = configjson.lang['en-US'].description.replace(search,process.env[actDesc]);
    search = new RegExp('{{'+editHeight+'}}', 'g');
	json.edit.height = convertNumberToInteger(configjson.edit.height.replace(search,process.env[editHeight]));    
    search = new RegExp('{{'+editWidth+'}}', 'g');	
	json.edit.width = convertNumberToInteger(configjson.edit.width.replace(search,process.env[editWidth]));  
    res.status(200).send( json );
});

// redirect to a page outside of this custom activity
app.get( '/ixn/activities/generic-activity/index.html', function( req, res ) {
    var caEditUrl = 'CA_EDIT_URL';
    var editCAUrl = process.env[caEditUrl];
    // add the number of steps to the query string ... not sensitive info
    var numSteps = process.env['CA_NUM_STEPS'];
    console.log("Number of steps: " + numSteps);
    var editCAUrl = editCAUrl + '?numSteps=' + numSteps;

    console.log("Redirecting to " + editCAUrl);

	res.redirect(302, editCAUrl );		
});

app.get( '/ixn/activities/generic-activity/', function( req, res ) {
    // pass back the placeholder text
	res.status(200).send( indexhtml );		
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
