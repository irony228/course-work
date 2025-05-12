module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define(
        'user', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10), 
                autoIncrement: true, 
                primaryKey: true 
            },
            username: {
                type: Sequelize.STRING(50),  
                allowNull: false 
            },
            password: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['Администратор', 'Гость'],
                allowNull: false,
                defaultValue: 'Гость'
            },
            firstname: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            lastname: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            middlename: {
                type: Sequelize.STRING(20)
            },
            phone_number: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false
            }
        });

    User.associate = (models) => {
        User.hasMany(models.booking, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return User;
};