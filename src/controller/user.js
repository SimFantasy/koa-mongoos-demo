const { User, Favorite } = require('@model')
const { jwtSign } = require('@utils/handleJwt')

class UserController {
	// 注册
	async create(ctx) {
		const user = ctx.request.body

		const userInfo = await User.create(user)

		ctx.user = {
			id: userInfo._id.toString(),
			username: userInfo.username,
			email: userInfo.email
		}

		ctx.body = {
			id: userInfo._id.toString(),
			username: userInfo.username,
			email: userInfo.email,
			bio: null,
			image: null
		}
	}

	// 登录
	async login(ctx) {
		const user = ctx.request.body

		const userInfo = await User.findOne({ email: user.email })

		const token = jwtSign({
			id: userInfo._id.toString(),
			username: userInfo.username,
			email: userInfo.email
		})

		ctx.body = {
			id: userInfo._id.toString(),
			username: userInfo.username,
			email: userInfo.email,
			token
		}
	}

	// 查询所有用户
	async findAllUsers(ctx) {
		const users = await User.find()

		// 是否登录
		if (!ctx.user) {
			const userList = users.map(user => ({
				id: user._id.toString(),
				username: user.username,
				email: user.email,
				bio: user.bio,
				image: user.image,
				isFollowed: false
			}))

			ctx.body = userList
		} else {
			// 是否关注
			const loginUser = await User.findById(ctx.user.id).select('+following')

			for (let user of users) {
				const isFollowed = loginUser.following.some(item => item.toString() === user._id.toString())

				user.isFollowed = isFollowed

				user.save()
			}

			const userList = users.map(user => ({
				id: user._id.toString(),
				username: user.username,
				email: user.email,
				bio: user.bio,
				image: user.image,
				isFollowed: user.isFollowed
			}))

			ctx.body = userList
		}
	}

	// 查询用户
	async findUser(ctx) {
		const { id } = ctx.params

		const user = await User.findById(id)

		// 是否登录
		if (!ctx.user) {
			ctx.body = {
				id: user._id.toString(),
				username: user.username,
				email: user.email,
				bio: user.bio,
				image: user.image,
				isFollowed: false
			}
		} else {
			// 是否关注
			const loginUser = await User.findById(ctx.user.id).select('+following')
			const isFollowed = loginUser.following.some(item => item.toString() === id)

			ctx.body = {
				id: user._id.toString(),
				username: user.username,
				email: user.email,
				bio: user.bio,
				image: user.image,
				isFollowed
			}
		}
	}

	// 关注用户
	async follow(ctx) {
		const { id } = ctx.params

		// 查询用户是否存在
		const userIsExist = await User.findById(id)

		if (!userIsExist) {
			ctx.throw(404, { message: '用户不存在' })
		}

		// 查询是否已经关注
		const loginUser = await User.findById(ctx.user.id).select('+following')
		const isFollowed = loginUser.following.some(item => item.toString() === id)

		if (isFollowed) {
			ctx.throw(409, { message: '已经关注过该用户' })
		}

		// 关注用户
		await User.findByIdAndUpdate(ctx.user.id, { $push: { following: id } })

		ctx.body = {
			id: userIsExist._id.toString(),
			username: userIsExist.username,
			email: userIsExist.email,
			bio: userIsExist.bio,
			image: userIsExist.image,
			isFollowed: true
		}
	}

	// 取消关注用户
	async unfollow(ctx) {
		const { id } = ctx.params

		// 查询用户是否存在
		const userIsExist = await User.findById(id)

		if (!userIsExist) {
			ctx.throw(404, { message: '用户不存在' })
		}

		// 查询是否已经关注
		const loginUser = await User.findById(ctx.user.id).select('+following')
		const isFollowed = loginUser.following.some(item => item.toString() === id)

		if (!isFollowed) {
			ctx.throw(409, { message: '还未关注该用户' })
		}

		// 取消关注用户
		await User.findByIdAndUpdate(ctx.user.id, { $pull: { following: id } })

		ctx.body = {
			id: userIsExist._id.toString(),
			username: userIsExist.username,
			email: userIsExist.email,
			bio: userIsExist.bio,
			image: userIsExist.image,
			isFollowed: false
		}
	}

	// 获取用户关注列表
	async followings(ctx) {
		const { id } = ctx.params

		const users = await User.findById(id).select('+following').populate('following')

		const userList = users.following.map(user => ({
			id: user._id.toString(),
			username: user.username,
			email: user.email,
			bio: user.bio,
			image: user.image,
			isFollowed: true
		}))

		ctx.body = userList
	}

	// 获取用户粉丝列表
	async followers(ctx) {
		const { id } = ctx.params

		const users = await User.find({ following: id })

		const userList = users.map(user => ({
			id: user._id.toString(),
			username: user.username,
			email: user.email,
			bio: user.bio,
			image: user.image,
			isFollowed: true
		}))

		ctx.body = userList
	}

	// 获取用户收藏文章列表
	async favorite(ctx) {
		const { id } = ctx.params

		const posts = await Favorite.find({ user: id }).populate('post')
		console.log('posts', posts)

		const postList = posts.map(post => ({
			id: post.post._id.toString(),
			title: post.post.title,
			description: post.post.description,
			body: post.post.body,
			tagList: post.post.tagList,
			isFavorite: true,
			createdAt: post.post.createdAt,
			updatedAt: post.post.updatedAt
		}))

		ctx.body = postList
	}
}

module.exports = new UserController()
