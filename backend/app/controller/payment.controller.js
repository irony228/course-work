var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Payment = db.payment;
const { Op } = require('sequelize');
// exports.findAll = (req, res) => {
//     Payment.findAll({
//         include: [
//             {
//                 model: db.status,
//                 as: 'status' 
//             }
//         ]
//         })
//         .then(objects => {
//             globalFunctions.sendResult(res, objects);
//         })
//         .catch(err => {
//             globalFunctions.sendError(res, err);
//         })
// };

exports.findAll = async (req, res) => {
    try {
      const { id, user_id, status, price_from, price_to, date_from, date_to } = req.query;
  
      let condition = {};
  
      if (id) {
        condition.id = id;
      }
      if (user_id) {
        condition.user_id = { [Op.like]: `%${user_id}%` };
      }
      if (price_from) {
        condition.amount = { [Op.gte]: price_from };
      }
      if (price_to) {
        condition.amount = {
          ...(condition.amount || {}),
          [Op.lte]: price_to
        };
      }
      if (date_from) {
        condition.payment_date = { [Op.gte]: date_from };
      }
      if (date_to) {
        condition.payment_date = {
          ...(condition.payment_date || {}),
          [Op.lte]: date_to
        };
      }
  
      const objects = await Payment.findAll({
        where: condition,
        include: [
          {
            model: db.status,
            as: 'status',
            where: status ? { name: status } : undefined
          }
        ]
      });
  
      globalFunctions.sendResult(res, objects);
    } catch (err) {
      globalFunctions.sendError(res, err);
    }
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