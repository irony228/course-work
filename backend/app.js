var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var db = require('./app/config/db.config.js'); // подключение настроек базы данных

db.sequelize.sync({force: false});

app.listen(3000);

var cors = require('cors');
var corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // указываем, откуда будут приходить запросы
    credentials: true, // разрешаем обрабатывать запросы
    optionSuccessStatus: 200 // при успешной обработке запроса будет возвращён статус 200
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