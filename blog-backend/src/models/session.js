
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database')

class Session extends Model {}

Session.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'Session',
  }
)

module.exports = Session
