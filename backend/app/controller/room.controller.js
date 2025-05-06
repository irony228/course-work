var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var Room = db.room;
var Type = db.type;
var Status = db.status;
var Capacity = db.capacity;

exports.findAll = (req, res) => {
    Room.findAll({
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
        })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
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
    Room.update({
        room_number: req.body.room_number,
        type_id: req.body.type_id,
        photo_url: req.body.photo_url,
        capacity_id: req.body.capacity_id,
        price: req.body.price,
        description: req.body.description, 
        status_id: req.body.status_id
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
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
    Room.findByPk(req.params.id)
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
