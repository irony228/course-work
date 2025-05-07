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

exports.create = (req, res) => {
    Booking.create({
        user_id: req.body.user_id,
        room_id: req.body.room_id,
        check_in_date: req.body.check_in_date,
        check_out_date: req.body.check_out_date,
        price: 0, // потом можешь рассчитать по длительности и цене комнаты
        status_id: 1, // например "в ожидании"
        created: new Date()
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};