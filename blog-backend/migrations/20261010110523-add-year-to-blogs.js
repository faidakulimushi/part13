
'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('blogs', 'year', {
      type: Sequelize.INTEGER,
      allowNull: true,
    })

    await queryInterface.sequelize.query(
      'UPDATE blogs SET year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER'
    )
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('blogs', 'year')
  },
}
