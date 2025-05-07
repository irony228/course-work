const { verifyToken } = require("../middleware/authJwt");

module.exports = (app) => {
    var { authJwt } = require("../middleware");
    const payment = require("../controller/payment.controller");
  
    app.post("/api/addPayment", [authJwt.verifyToken], payment.create);

    app.post("/api/updatePayment/:booking_id", [authJwt.verifyToken], payment.update);

    app.get("/api/payment/:booking_id",  payment.findByBookingId);
  };
  