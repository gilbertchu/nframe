//TODO webserver entry point for spawn
//TODO unix port option for redis clients and express server
require('dotenv').config();
var path = require('path');
var appDir = path.dirname(require.main.filename);
//console.log(appDir);
process.chdir(appDir);

//Start log helper for debugging
//const LogHelper = require('./utils/LogHelper.js');
//var log = new LogHelper("App Main");
//log.header();

//Init depedencies
const express = require('express');
const exphbs = require('express-handlebars');
//const session = require('express-session');
//const Redis = require('ioredis');
//const RedisStore = require('connect-redis')(session);
const app = express();

//Config
const port = process.env.PORT;
//app.set('trust proxy', 'loopback');
app.disable('etag');
app.disable('x-powered-by');

/*
//Session
const sessClient = new Redis({
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	password: process.env.REDIS_PASSWORD,
	db: process.env.REDIS_SESS_DB
});
app.use(session({
    store: new RedisStore({client: sessClient, disableTTL: true}),
    secret: process.env.REDIS_STORE_SECRET,
    resave: false,
    saveUninitialized: false
}));
*/

//Views
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

//Routing and middleware
//const urlParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(path.join(__dirname, '/public')));
const test_api = require('./routers/test_api.js');
app.use('/test', test_api);

//Catch 404 error
app.use(function(req, res, next) {
	var err = new Error('404');
	err.status = 404;
	console.log("[404]", req.method, req.originalUrl);
	next(err);
});

//Error handling
app.use(function(err, req, res, next) {
	if (typeof err.stack === "undefined" || !err.stack) {
		var message = (process.env.NODE_ENV !== 'production') ? err : "Internal Server Error";
		err = new Error(err);
		err.status = 500;
	}
	console.log("[app catch]", err);
	res.status(err.status || 500);
	var logging = (process.env.NODE_ENV !== 'production') ? true : false;
	res.render('error', {
		error: err,
		logging: logging
	});
});


//TODO handle spawning processes from spawn, not here (this is old code, need to fix it)
const http = require('http');
const server = http.createServer(app);
server.listen(port, function() {
	console.log('Webserver listening on port:',port);
});
