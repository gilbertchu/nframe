//TODO webserver entry point for spawn
//TODO unix port option for redis clients and express server

//Start log helper for debugging
const log = require('./utils/LogHelper.js')("App Main");
log.header();

//Init depedencies
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const app = express();

//Config
var port = process.env.PORT;
//app.set('trust proxy', 'loopback');
app.disable('etag');
app.disable('x-powered-by');

//Session
var sessClient = new Redis({
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

//Views
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

//Routing and middleware
var urlParser = bodyParser.urlencoded({ extended: false });
app.post('/auth', urlParser, function (req, res, next) {
	if (!req.body || !req.body.username || !req.body.password || !req.body.token) {
		res.render('error', {error:{status:400, message:"Bad Request. Missing required fields."}, logging:false});
		return;
	}
	delete req.session.csrf_token;
	if (req.body.token !== req.session.csrf_token) {
		res.render('error', {error:{status:400, message:"Bad Request. Token mismatch."}, logging:false});
		return;
	}
	//TODO testing only - we need actual accounts
	if (req.body.username === "gilbert" && req.body.password === "test") {
		req.session.admin = "gilbert-test";
	}
	res.redirect('/admin');
});
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/', base_router);
app.use('/admin', admin_router);

//Catch 404 error
app.use(function(req, res, next) {
	var err = new Error('404');
	err.status = 404;
	next(err);
});

//Error handling
app.use(function(err, req, res, next) {
	if (typeof err.stack === "undefined" || !err.stack) {
		var message = (process.env.NODE_ENV !== 'production') ? err : "Internal Server Error";
		err = new Error(err);
		err.status = 500;
	}
	console.log(err);
	res.status(err.status || 500);
	var logging = (process.env.NODE_ENV !== 'production') ? true : false;
	res.render('error', {
		error: err,
		logging: logging
	});
});

//TODO handle spawning processes from spawn, not here (this is old code, need to fix it)
/*
// Start server (we should init from a different index instead, may need to add stuff like https, clustering, ws, etc.)
//var cluster = require('cluster');
//var fork = require('child_process').fork;
var http = require('http');
var server = http.createServer(app);
//require('./process/websockets')(server); //front-facing websockets
server.listen(port, function() {
	console.log('Webserver listening on port:',port);
});
*/