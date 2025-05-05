var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Booking = db.booking;

exports.findAll = (req, res) => {
    Booking.findAll({
        include: [
            {
                model: Status,
                as: 'status' 
            }
        ]
        })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};