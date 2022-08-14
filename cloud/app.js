// Require the module
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
const Parse = require('parse/node');

// Set up the views directory
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set up the Body Parser to your App
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 
app.use(cookieParser("VA-11"));

// Set up Parse
Parse.initialize("APP_KEY","JS_KEY");
Parse.serverURL = "https://parseapi.back4app.com/";

//Require the routes.js file
require('./routes.js');