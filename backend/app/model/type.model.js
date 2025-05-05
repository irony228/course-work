module.exports = (sequelize, Sequelize) => {
    var Type = sequelize.define(
        'type',
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            }
        });

    Type.associate = (models) => {
        Type.hasMany(models.room, {
            foreignKey: 'type_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return Type;
};