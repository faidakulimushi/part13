const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  'blog',
  'postgres',
  'mysecretpassword',
  {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
  }
)

module.exports = sequelize