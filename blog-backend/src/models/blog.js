
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
  // Create the blogs table and ownership column if they do not exist
  async initialize() {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        author VARCHAR(255),
        url TEXT,
        title TEXT,
        likes INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    // Also support an existing blogs table missing these columns
    await sequelize.query(`
      ALTER TABLE blogs
      ADD COLUMN IF NOT EXISTS user_id INTEGER
      REFERENCES users(id) ON DELETE SET NULL
    `)

    await sequelize.query(`
      ALTER TABLE blogs
      ADD COLUMN IF NOT EXISTS created_at
      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `)

    await sequelize.query(`
      ALTER TABLE blogs
      ADD COLUMN IF NOT EXISTS updated_at
      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    `)
  },

  async findAll() {
    return sequelize.query(
      `SELECT ${blogColumns} FROM blogs ORDER BY id`,
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
          userId,
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