var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Room = db.room;

exports.findAll = (req, res) => {
    Room.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};