 'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('blogs')

    if (!table.year) {
      await queryInterface.addColumn('blogs', 'year', {
        type: Sequelize.INTEGER,
        allowNull: true,
      })
    }

    await queryInterface.sequelize.query(
      'UPDATE blogs SET year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER WHERE year IS NULL'
    )
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('blogs')

    if (table.year) {
      await queryInterface.removeColumn('blogs', 'year')
    }
  },
}