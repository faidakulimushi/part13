
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
      unique: {
        name: 'users_username_unique',
        msg: 'username must be unique',
      },
      validate: {
        notEmpty: true,
        isEmail: {
          msg: 'username must be a valid email address',
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
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
