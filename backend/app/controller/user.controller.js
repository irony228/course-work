var db = require('../config/db.config.js');
var globalFunctions = require('../config/global.functions.js');
var User = db.user;
const { Op } = require("sequelize");

exports.findAll = async (req, res) => {
    try {
        const { id, lastname, firstname, email, role, phone_number} = req.query;

        let condition = {};

        if(id){
            condition.id = id;
        }
        if(lastname){
            condition.lastname = {[Op.like]: `%${lastname}%`};
        }
        if(firstname){
            condition.firstname = {[Op.like]: `%${firstname}%`};
        }
        if(email){
            condition.email = {[Op.like]: `%${email}%`};
        }
        if(role){
            condition.role = {[Op.like]: `%${role}%`};
        }
        if(phone_number){
            condition.phone_number = {[Op.like]: `%${phone_number}%`};
        }
        const objects = await User.findAll({
            where:condition
        });
        globalFunctions.sendResult(res, objects);  
    } catch (err){
        globalFunctions.sendError(res, err);
    }
};

exports.create = (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middlename: req.body.middlename,
        phone_number: req.body.phone_number,
        email: req.body.email
    }).then(object => {
        globalFunctions.sendResult(res, object);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.update = (req, res) => {
    User.update({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            middlename: req.body.middlename,
            phone_number: req.body.phone_number,
            email: req.body.email
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
    User.destroy({
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
    User.findByPk(req.params.id)
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

exports.findByName = (req, res) => {
    User.findAll({
        where: {
            username: req.params.username
        }
    }).then(objects => {
        globalFunctions.sendResult(res, objects);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};