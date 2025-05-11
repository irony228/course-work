var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Booking = db.booking;
var Status = db.status;
var Room = db.room;

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

const { Op } = require("sequelize");

// Проверка и обновление статусов бронирований и комнат
const checkAndUpdateRoomStatus = async () => {
  const outdatedBookings = await Booking.findAll({
    where: {
      check_out_date: {
        [Op.lt]: new Date() // check_out_date < текущего времени
      },
      [Op.or]: [{status_id: 2},{status_id: 1},{status_id: 3}], // только активные бронирования
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