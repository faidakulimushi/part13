
const { Sequelize } = require('sequelize')

const databaseUrl =
  process.env.TESTING === 'true'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    'Missing database URL. Check DATABASE_URL and TEST_DATABASE_URL in .env'
  )
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
})

module.exports = sequelize
