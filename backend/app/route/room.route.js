module.exports = (app) => {

    const room = require('../controller/room.controller');
    
    app.get('/api/listRooms', room.findAll);

    app.post('/api/addRoom', room.create);

    app.post('/api/updateRoom/:id', room.update);

    app.post('/api/deleteRoom/:id', room.delete);

    app.get('/api/room/:id', room.findById);

    app.get('/api/room/number/:room_number', room.findByNumber);
};