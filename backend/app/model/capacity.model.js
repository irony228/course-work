module.exports = (sequelize, Sequelize) => {
    var Capacity = sequelize.define(
        'capacity',
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

    Capacity.associate = (models) => {
        Capacity.hasMany(models.room, {
            foreignKey: 'capacity_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return Capacity;
};