module.exports = (sequelize, Sequelize) => {
    var Booking = sequelize.define(
        'booking', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10), // тип данных INTEGER
                autoIncrement: true, // включение автоматической нумерации
                primaryKey: true // поле является первичным ключом
            },
            user_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            room_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            check_in_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            check_out_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT(10,2),
                allowNull: false
            },
            status_id: {
                type: Sequelize.INTEGER(50),
                allowNull: false,
                references: {
                    model: 'status',
                    key: 'id'
                }
            },
            created: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });

    Booking.associate = (models) => {
        Booking.hasMany(models.payment, {
            foreignKey: 'booking_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });

        Booking.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

        Booking.belongsTo(models.room, {
            foreignKey: 'room_id'
        });

        Booking.belongsTo(models.status, {
            foreignKey: 'status_id',
            as: 'status'
        });
    };
    return Booking;
};