var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Type = db.type;

exports.findAll = (req, res) => {
    Type.findAll()
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};