const Router = require('@koa/router')
const {
	create,
	login,
	findAllUsers,
	findUser,
	follow,
	unfollow,
	followings,
	followers,
	favorite
} = require('@controller/user')
const authVerify = require('@middleware/auth')
const router = new Router({ prefix: '/users' })

// 注册
router.post('/', create)

// 登录
router.post('/login', login)

// 查询所有用户
router.get('/', authVerify(false), findAllUsers)

// 查询用户
router.get('/:id', authVerify(false), findUser)

// 关注用户
router.post('/:id/follow', authVerify(), follow)

// 取消关注用户
router.delete('/:id/follow', authVerify(), unfollow)

// 获取用户关注列表
router.get('/:id/following', followings)

// 获取用户粉丝列表
router.get('/:id/followers', followers)

// 获取用户收藏文章列表
router.get('/:id/favorites', favorite)

module.exports = router
