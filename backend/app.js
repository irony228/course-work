var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var db = require('./app/config/db.config.js'); // подключение настроек базы данных

db.sequelize.sync({force: false});

app.listen(3000);

var type = require('./app/route/type.route.js');
type(app);

var room = require('./app/route/room.route.js');
room(app);

var status = require('./app/route/status.route.js');
status(app);