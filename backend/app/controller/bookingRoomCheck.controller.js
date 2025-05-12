process.env.TZ = 'Asia/Irkutsk';
const cron = require("node-cron");
var db = require('../config/db.config.js');
var Room = db.room;
var Booking = db.booking;   
const { Op } = require("sequelize");

const checkAndUpdateRoomStatus = async () => {
  try {
    const outdatedBookings = await Booking.findAll({
      where: {
        check_out_date: {
          [Op.lt]: new Date()
        },
        [Op.or]: [{status_id: 2},{status_id: 1}],
      }
    });

    for (const booking of outdatedBookings) {
      await Room.update(
        { status_id: 6 }, 
        { where: { id: booking.room_id } }
      );
      await Booking.update(
        { status_id: 3 },
        { where: { id: booking.id } }
      );
      console.log(`Бронирование №${booking.id} завершено, комната c id:${booking.room_id} освобождена.`);
    }

  } catch (error) {
    console.error("Ошибка в cron-задаче:", error);
  }
};

cron.schedule("*/5 * * * *", () => {
  console.log("Выполняем проверку просроченных бронирований...");
  checkAndUpdateRoomStatus();
});
