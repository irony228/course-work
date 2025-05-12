var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Booking = db.booking;
var Status = db.status;
var Room = db.room;
var User = db.user;
const { Op } = require("sequelize");
// exports.findAll = (req, res) => {
//     const where = {};

//     if (req.query.status_id) where.status_id = req.query.status_id;
//     if (req.query.user_id) where.user_id = req.query.user_id;
//     if (req.query.room_id) where.room_id = req.query.room_id;
//     if (req.query.date_from && req.query.date_to) {
//         where.check_in_date = {
//             [db.Sequelize.Op.between]: [req.query.date_from, req.query.date_to]
//         };
//     }

//     Booking.findAll({
//         where,
//         include: [
//             { model: Status, as: 'status' },
//             { model: User, as: 'user' },
//             { model: Room, as: 'room' }
//         ]
//     })
//     .then(objects => {
//         globalFunctions.sendResult(res, objects);
//     })
//     .catch(err => {
//         globalFunctions.sendError(res, err);
//     });
// };

exports.findAll = async (req, res) => {
    try {
        const { price_from, price_to, user_id, lastname, date_from, date_to, id } = req.query;

        let condition = {};
        let include = [
            {
                model: Status,
                as: 'status'
            },
            {
                model: Room,
                as: 'room'
            }
        ];
        if(id){
            condition.id = id;
        }
        if(price_from){
            condition.price = { [Op.gte]: price_from};
        }
        if(price_to){
            condition.price = {
                ...(condition.price || {}),
                [Op.lte]: price_to
            };
        }
        if(user_id){
            condition.user_id = user_id;
        }
        if(date_from){
            condition.created = {[Op.gte]: date_from};
        }
        if(date_to){
            condition.created = {
                ...(condition.created || {}),
                [Op.lte]: date_to
            };
        }
        if (lastname) {
            include.push({
                model: User,
                as: 'user',
                where: {
                    lastname: {
                        [Op.like]: `%${lastname}%`
                    }
                }
            });
        } else {
            include.push({
                model: User,
                as: 'user'
            });
        }

        const objects = await Booking.findAll({
            where: condition,
            include: include
        });
        globalFunctions.sendResult(res,objects);
    } catch (err){
        globalFunctions.sendError(res, err);
    }
};

exports.create = (req, res) => {
    Booking.create({
        user_id: req.body.user_id,
        room_id: req.body.room_id,
        check_in_date: req.body.check_in_date,
        check_out_date: req.body.check_out_date,
        price: req.body.price, // потом можешь рассчитать по длительности и цене комнаты
        status_id: 1, // например "в ожидании"
        created: new Date()
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.update = (req, res) => {
    const updateData = {};
  
    if (req.body.user_id !== undefined) updateData.user_id = req.body.user_id;
    if (req.body.room_id !== undefined) updateData.room_id = req.body.room_id;
    if (req.body.check_in_date !== undefined) updateData.check_in_date = req.body.check_in_date;
    if (req.body.check_out_date !== undefined) updateData.check_out_date = req.body.check_out_date;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.status_id !== undefined) updateData.status_id = req.body.status_id;
    if (req.body.created !== undefined) updateData.created = req.body.created;
  
    Booking.update(updateData, {
        where: { id: req.params.id }
    })
    .then(object => {
        globalFunctions.sendResult(res, object);
    })
    .catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.findUserBookings = async (req,res) => {
    //await checkAndUpdateRoomStatus();
    Booking.findAll({
        where: {
            user_id: req.params.user_id
        },
        include: [
            {
                model: Status,
                required: true,
                as: 'status' 
            },
            {
                model: Room,
                required: true,
                as: 'room',
                include: [
                  {
                    model: db.capacity,
                    required: true,
                    as: 'capacity'
                  },
                  {
                    model: db.type,
                    required: true,
                    as: 'type'
                  }
                ]
            },
        ],
        order:[
            'created'
        ]
        })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
}


// Проверка и обновление статусов бронирований и комнат
const checkAndUpdateRoomStatus = async () => {
  const outdatedBookings = await Booking.findAll({
    where: {
      check_out_date: {
        [Op.lt]: new Date() // check_out_date < текущего времени
      },
      [Op.or]: [{status_id: 2},{status_id: 1}], // только активные бронирования
    }
  });

  for (const booking of outdatedBookings) {
    // Освобождаем комнату
    await Room.update(
      { status_id: 6 }, // статус 'Свободна'
      { where: { id: booking.room_id } }
    );

    // Меняем статус бронирования на 'Завершено' (допустим, статус 5)
    await Booking.update(
      { status_id: 8 },
      { where: { id: booking.id } }
    );
  }
};