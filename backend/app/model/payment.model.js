module.exports = (sequelize, Sequelize) => {
    var Payment = sequelize.define(
        'payment', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10), 
                autoIncrement: true,
                primaryKey: true 
            },
            booking_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            amount: {
                type: Sequelize.FLOAT(10,2),
                allowNull: false
            },
            payment_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            method: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            status_id: {
                type: Sequelize.INTEGER(50),
                allowNull: false,
                references: {
                    model: 'status',
                    key: 'id'
                }
            }
        });

    Payment.associate = (models) => {
        Payment.belongsTo(models.booking, {
            foreignKey: 'booking_id'
        });

        Payment.belongsTo(models.status, {
            foreignKey: 'status_id',
            as: 'status'
        });
    };
    return Payment;
};