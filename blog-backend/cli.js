const sequelize = require('./src/database')
const { QueryTypes } = require('sequelize')

const main = async () => {
  const blogs = await sequelize.query(
    'SELECT * FROM blogs',
    { type: QueryTypes.SELECT }
  )

  blogs.forEach(blog => {
    console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
  })

  await sequelize.close()
}

main()