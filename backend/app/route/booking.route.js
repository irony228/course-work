module.exports = (app) => {

    var { authJwt } = require("../middleware");

    const booking = require('../controller/booking.controller');
    
    //app.get('/api/capacities',  [authJwt.verifyToken], capacity.findAll);

    app.post('/api/addBooking',  [authJwt.verifyToken], booking.create);

    //app.post('/api/updateCapacity/:id',  [authJwt.verifyToken], capacity.update);

    //app.post('/api/deleteCapacity/:id',  [authJwt.verifyToken], capacity.delete);

    //app.get('/api/capacity/:id',  [authJwt.verifyToken], capacity.findById);

    //app.get('/api/capacity/name/:name',  [authJwt.verifyToken], capacity.findByName);
};