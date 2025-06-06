var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./app/controller/bookingRoomCheck.controller.js");
require('./app/controller/bookingTimer.controller.js');

var db = require('./app/config/db.config.js'); 

db.sequelize.sync({force: false});

app.listen(3000);

var cors = require('cors');
var corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true, 
    optionSuccessStatus: 200 
};
app.use(cors(corsOptions));

var type = require('./app/route/type.route.js');
type(app);

var room = require('./app/route/room.route.js');
room(app);

var status = require('./app/route/status.route.js');
status(app);

var user = require('./app/route/user.route.js');
user(app);

var capacity = require('./app/route/capacity.route.js');
capacity(app);

var auth = require('./app/route/auth.route.js');
auth(app);

var booking = require('./app/route/booking.route.js');
booking(app);

var payment = require('./app/route/payment.route.js');
payment(app);