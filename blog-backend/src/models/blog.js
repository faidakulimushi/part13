const sequelize = require('../database')
const { QueryTypes } = require('sequelize')

const Blog = {
  async findAll() {
    return await sequelize.query(
      'SELECT * FROM blogs',
      { type: QueryTypes.SELECT }
    )
  },

  async create(blog) {
    const { author, url, title, likes } = blog

    const result = await sequelize.query(
      `INSERT INTO blogs (author, url, title, likes)
       VALUES (:author, :url, :title, :likes)
       RETURNING *`,
      {
        replacements: {
          author,
          url,
          title,
          likes: likes ?? 0
        },
        type: QueryTypes.SELECT
      }
    )

    return result[0]
  },

  async findByPk(id) {
    const result = await sequelize.query(
      'SELECT * FROM blogs WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.SELECT
      }
    )

    return result[0]
  },

  async destroy(id) {
    await sequelize.query(
      'DELETE FROM blogs WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.DELETE
      }
    )
  }
}

module.exports = Blog