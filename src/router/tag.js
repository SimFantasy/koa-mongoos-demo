const Router = require('@koa/router')
const { findAllTags, findAllTagPosts } = require('@controller/post')
const router = new Router({ prefix: '/tags' })

// 查询所有标签
router.get('/', findAllTags)

// 查询所有标签文章
router.get('/:tag', findAllTagPosts)

module.exports = router
