const cron = require("node-cron");
var db = require('../config/db.config.js');
var Room = db.room;
var Booking = db.booking;   
const { Op } = require("sequelize");

// Функция для проверки и обновления статусов
const checkAndUpdateRoomStatus = async () => {
  try {
    const outdatedBookings = await Booking.findAll({
      where: {
        check_out_date: {
          [Op.lt]: new Date() // время уже вышло
        },
        [Op.or]: [{status_id: 2},{status_id: 1},{status_id: 3}], // активные брони
      }
    });

    for (const booking of outdatedBookings) {
      // Освобождаем комнату
      await Room.update(
        { status_id: 6 }, // статус 'Свободна'
        { where: { id: booking.room_id } }
      );

      // Меняем статус брони на 'Завершено'
      await Booking.update(
        { status_id: 5 },
        { where: { id: booking.id } }
      );

      console.log(`Бронирование №${booking.id} завершено, комната c id:${booking.room_id} освобождена.`);
    }

  } catch (error) {
    console.error("Ошибка в cron-задаче:", error);
  }
};

// Создаём задачу, которая будет выполняться каждые 5 минут
cron.schedule("*/5 * * * *", () => {
  console.log("Выполняем проверку просроченных бронирований...");
  checkAndUpdateRoomStatus();
});
