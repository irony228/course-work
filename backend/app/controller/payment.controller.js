var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Payment = db.payment;

exports.findAll = (req, res) => {
    Payment.findAll({
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