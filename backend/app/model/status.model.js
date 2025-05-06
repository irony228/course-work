module.exports = (sequelize, Sequelize) => {
    var Status = sequelize.define(
        'status',
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true
            },
            entity_type : {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            name:{
                type: Sequelize.STRING(50),
                allowNull: false
            }
        });

    Status.associate = (models) => {
        Status.hasMany(models.room, {
            foreignKey: 'status_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id',
            as: 'status'
        });
    };
    return Status;
};