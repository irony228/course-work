process.env.TZ = 'Asia/Irkutsk';
const { Op } = require("sequelize");
var db = require('../config/db.config.js');
var Booking = db.booking;   
var Room = db.room;
setInterval(async () => {
  const now = new Date();
  const expiredBookings = await Booking.findAll({
    where: {
      status_id: 1,
      created: {
        [Op.lt]: new Date(now.getTime() - 10 * 60 * 1000) 
      }
    }
  });

  for (const booking of expiredBookings) {
    booking.status_id = 3;
    await booking.save();
    await Room.update(
        { status_id: 6 },
        { where: { id: booking.room_id } }
      );
  }
}, 20*1000);
