const Router = require('@koa/router')
const {
	create,
	findAllPosts,
	findPost,
	favorite,
	unfavorite,
	findAllTags
} = require('@controller/post')
const authVerify = require('@middleware/auth')
const router = new Router({ prefix: '/posts' })

// 发表文章
router.post('/', authVerify(), create)

// 查询所有文章
router.get('/', authVerify(false), findAllPosts)

// 查询文章
router.get('/:id', authVerify(false), findPost)

// 收藏文章
router.post('/:id/favorite', authVerify(), favorite)

// 取消收藏文章
router.delete('/:id/favorite', authVerify(), unfavorite)

module.exports = router
