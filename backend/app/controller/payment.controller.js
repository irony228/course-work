var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Payment = db.payment;

exports.findAll = (req, res) => {
    Payment.findAll({
        include: [
            {
                model: db.status,
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
    Payment.create({
      booking_id: req.body.booking_id,
      amount: req.body.amount,
      payment_date: new Date(),
      method: "card",
      status_id: 5  // например, 4 = успешно
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  };

exports.update = (req, res) => {
    const updateData = {};
  
    if (req.body.booking_id !== undefined) updateData.booking_id = req.body.booking_id;
    if (req.body.amount !== undefined) updateData.amount = req.body.amount;
    if (req.body.payment_date !== undefined) updateData.payment_date = req.body.payment_date;
    if (req.body.method !== undefined) updateData.method = req.body.method;
    if (req.body.status_id !== undefined) updateData.status_id = req.body.status_id;
  
    Payment.update(updateData, {
        where: { booking_id: req.params.booking_id }
    })
    .then(object => {
        globalFunctions.sendResult(res, object);
    })
    .catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.findByBookingId = (req, res) => {
    Payment.findAll({
        where: {
            booking_id: req.params.booking_id
        }
    })
    .then(object => {
        globalFunctions.sendResult(res, object);
    })
    .catch(err => {
        globalFunctions.sendError(res, err);
    });
};