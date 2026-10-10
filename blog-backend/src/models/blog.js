
const sequelize = require('../database')
const { QueryTypes } = require('sequelize')

const blogColumns = `
  id,
  author,
  url,
  title,
  likes,
  user_id AS "userId",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`

const Blog = {
  async findAll(search) {
    if (search) {
      return sequelize.query(
        `SELECT ${blogColumns}
         FROM blogs
         WHERE title ILIKE :search
            OR author ILIKE :search
         ORDER BY likes DESC, id ASC`,
        {
          replacements: { search: `%${search}%` },
          type: QueryTypes.SELECT,
        }
      )
    }

    return sequelize.query(
      `SELECT ${blogColumns}
       FROM blogs
       ORDER BY likes DESC, id ASC`,
      { type: QueryTypes.SELECT }
    )
  },

  async create(blog) {
    const { author, url, title, likes, userId } = blog

    const result = await sequelize.query(
      `INSERT INTO blogs
        (author, url, title, likes, user_id)
       VALUES
        (:author, :url, :title, :likes, :userId)
       RETURNING ${blogColumns}`,
      {
        replacements: {
          author,
          url: url ?? null,
          title: title ?? null,
          likes: likes ?? 0,
          userId: userId ?? null,
        },
        type: QueryTypes.SELECT,
      }
    )

    return result[0]
  },

  async findByPk(id) {
    const result = await sequelize.query(
      `SELECT ${blogColumns}
       FROM blogs
       WHERE id = :id`,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    )

    return result[0]
  },

  async updateLikes(id, likes) {
    const result = await sequelize.query(
      `UPDATE blogs
       SET likes = :likes,
           updated_at = NOW()
       WHERE id = :id
       RETURNING ${blogColumns}`,
      {
        replacements: { id, likes },
        type: QueryTypes.SELECT,
      }
    )

    return result[0]
  },

  async destroy(id) {
    await sequelize.query(
      'DELETE FROM blogs WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    )
  },
}

module.exports = Blog
