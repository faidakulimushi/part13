
const path = require('path')

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },

  test: {
    use_env_variable: 'TEST_DATABASE_URL',
    dialect: 'postgres',
  },
}
