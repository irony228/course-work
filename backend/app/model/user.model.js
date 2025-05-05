module.exports = (sequelize, Sequelize) => {
    var User = sequelize.define(
        'user', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10), // тип данных INTEGER
                autoIncrement: true, // включение автоматической нумерации
                primaryKey: true // поле является первичным ключом
            },
            username: {
                type: Sequelize.STRING(50),  // тип данных STRING (в MySQL — VARCHAR)
                allowNull: false // настройка allowNull со значением false запрещает запись в поле значений NULL (для поля с настройкой автоинкремента можно не указывать)
            },
            password: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            role: {
                type: Sequelize.ENUM,
                values: ['Администратор', 'Гость'],
                allowNull: false
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

    // Определяем связи таблицы user с другими таблицами
    User.associate = (models) => {
        // Определение связи один-ко-многим с таблицей cart. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны таблицы cart): в файле cart.model.js
        User.hasMany(models.booking, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return User;
};