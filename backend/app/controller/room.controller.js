var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Room = db.room;
var Type = db.type;
var Status = db.status;
var Capacity = db.capacity;
var Booking = db.booking;   
const { Op } = require("sequelize");

exports.findAll = async (req, res) => {
    try {
        // 1. Проверка и освобождение просроченных бронирований
        const outdatedBookings = await Booking.findAll({
            where: {
                check_out_date: {
                    [Op.lt]: new Date() // дата уже в прошлом
                },
                status_id: 1 // например, статус "Активно"
            }
        });

        for (const booking of outdatedBookings) {
            // Освобождаем комнату
            await Room.update(
                { status_id: 6 }, // статус "Свободна"
                { where: { id: booking.room_id } }
            );

            // Меняем статус брони на "Завершено"
            await Booking.update(
                { status_id: 5 }, // статус "Завершено"
                { where: { id: booking.id } }
            );
        }

        // 2. Отдаём комнаты с актуальными статусами
        const objects = await Room.findAll({
            include: [
                {
                    model: Type,
                    required: true
                },
                {
                    model: Status,
                    required: true,
                    as: 'status'
                },
                {
                    model: Capacity,
                    required: true
                }
            ]
        });

        globalFunctions.sendResult(res, objects);

    } catch (err) {
        globalFunctions.sendError(res, err);
    }
};

exports.create = (req, res) => {
    Room.create({
        room_number: req.body.room_number,
        type_id: req.body.type_id,
        photo_url: req.body.photo_url,
        capacity_id: req.body.capacity_id,
        price: req.body.price,
        description: req.body.description, 
        status_id: req.body.status_id
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.update = (req, res) => {
    const updateData = {};
  
    if (req.body.room_number !== undefined) updateData.room_number = req.body.room_number;
    if (req.body.type_id !== undefined) updateData.type_id = req.body.type_id;
    if (req.body.photo_url !== undefined) updateData.photo_url = req.body.photo_url;
    if (req.body.capacity_id !== undefined) updateData.capacity_id = req.body.capacity_id;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.status_id !== undefined) updateData.status_id = req.body.status_id;
  
    Room.update(updateData, {
        where: { id: req.params.id }
    })
    .then(object => {
        globalFunctions.sendResult(res, object);
    })
    .catch(err => {
        globalFunctions.sendError(res, err);
    });
  };

exports.delete = (req, res) => {
    Room.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.findById = (req, res) => {
    Room.findByPk(req.params.id,{
        include: [
            {
                model: Type,
                required: true
            },
            {
                model: Status,
                requried: true,
                as: 'status'
            },
            {
                model: Capacity,
                required: true
            }
        ]
    }
        
    )
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

exports.findByNumber = (req, res) => {
    Room.findAll({
        where: {
            room_number: req.params.room_number
        },
        include: [
            {
                model: Type,
                required: true
            },
            {
                model: Status,
                required: true,
                as: 'status'
            },
            {
                model: Capacity,
                required: true
            }
        ]
    }).then(objects => {
        globalFunctions.sendResult(res, objects);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};
