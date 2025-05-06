module.exports = (app) => {

    var { authJwt } = require("../middleware");
 
    const room = require('../controller/room.controller');
    
    app.get('/api/listRooms',  [authJwt.verifyToken], room.findAll);

    app.post('/api/addRoom',  [authJwt.verifyToken], room.create);

    app.post('/api/updateRoom/:id',  [authJwt.verifyToken], room.update);

    app.post('/api/deleteRoom/:id',  [authJwt.verifyToken], room.delete);

    app.get('/api/room/:id',  [authJwt.verifyToken], room.findById);

    app.get('/api/room/number/:room_number',  [authJwt.verifyToken], room.findByNumber);
};