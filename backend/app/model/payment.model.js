module.exports = (sequelize, Sequelize) => {
    var Payment = sequelize.define(
        'payment', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10), // тип данных INTEGER
                autoIncrement: true, // включение автоматической нумерации
                primaryKey: true // поле является первичным ключом
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
            status: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        });

    Payment.associate = (models) => {
        Payment.belongsTo(models.booking, {
            foreignKey: 'booking_id'
        });
    };
    return Payment;
};