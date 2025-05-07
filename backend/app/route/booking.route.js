module.exports = (app) => {

    var { authJwt } = require("../middleware");

    const booking = require('../controller/booking.controller');
    
    app.get('/api/bookings/:user_id', [authJwt.verifyToken],  booking.findUserBookings);

    app.post('/api/addBooking',  [authJwt.verifyToken], booking.create);

    app.post('/api/updateBooking/:id',  [authJwt.verifyToken], booking.update);
};