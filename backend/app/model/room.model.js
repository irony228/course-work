module.exports = (sequelize, Sequelize) => {
    var Room = sequelize.define(
        'room', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10), // тип данных INTEGER
                autoIncrement: true, // включение автоматической нумерации
                primaryKey: true // поле является первичным ключом
            },
            room_number: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            type_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            photo_url: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            capacity: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            price: {
                type: Sequelize.FLOAT(10,2),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
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

    Room.associate = (models) => {
        Room.hasMany(models.booking, {
            foreignKey: 'room_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });

        Room.belongsTo(models.type, {
            foreignKey: 'type_id'
        });

        Room.belongsTo(models.status, {
            foreignKey: 'status_id',
            as: 'status'
          });
    };
    return Room;
};