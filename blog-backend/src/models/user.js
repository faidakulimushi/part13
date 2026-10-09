const { Model, DataTypes } = require('sequelize')
const sequelize = require('../database')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user',
  }
)

module.exports = User