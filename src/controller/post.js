const { Post, User, Favorite } = require('@model')

class PostController {
	// 创建文章
	async create(ctx) {
		const post = ctx.request.body
		const { id } = ctx.user

		// 查询作者信息
		const author = await User.findById(id, 'username bio image')
		// 添加作者信息到文章
		post.author = id
		// 创建文章
		const postInfo = await Post.create(post)

		ctx.body = {
			id: postInfo._id.toString(),
			title: postInfo.title,
			description: postInfo.description,
			body: postInfo.body,
			tags: postInfo.tags,
			author: {
				username: author.username,
				bio: author.bio,
				image: author.image
			},
			createdAt: postInfo.createdAt,
			updatedAt: postInfo.updatedAt
		}
	}

	// 查询所有文章
	async findAllPosts(ctx) {
		const { page = 1, per_page = 10, q } = ctx.query

		const posts = await Post.find({
			tags: new RegExp(q)
		})
			.populate('author', '-_id username bio image')
			.sort({ createdAt: -1 })
			.skip((+page - 1) * +per_page)
			.limit(+per_page)

		if (!ctx.user) {
			ctx.body = [
				...posts.map(post => ({
					id: post._id.toString(),
					title: post.title,
					description: post.description,
					body: post.body,
					tags: post.tags,
					autor: {
						username: post.author.username,
						bio: post.author.bio,
						image: post.author.image
					},
					isFavorite: false,
					createdAt: post.createdAt,
					updatedAt: post.updatedAt
				}))
			]
		} else {
			const { id } = ctx.user

			const favorites = await Favorite.find({ author: id })

			ctx.body = [
				...posts.map(post => ({
					id: post._id.toString(),
					title: post.title,
					description: post.description,
					body: post.body,
					tags: post.tags,
					autor: {
						username: post.author.username,
						bio: post.author.bio,
						image: post.author.image
					},
					isFavorite: favorites.some(favorite => favorite.post.toString() === post._id.toString()),
					createdAt: post.createdAt,
					updatedAt: post.updatedAt
				}))
			]
		}
	}

	// 查询文章
	async findPost(ctx) {
		const { id } = ctx.params
		const post = await Post.findById(id).populate('author')

		if (!post) {
			ctx.throw(404, { message: '文章不存在' })
		}

		if (!ctx.user) {
			ctx.body = {
				id: post._id.toString(),
				title: post.title,
				description: post.description,
				body: post.body,
				tags: post.tags,
				author: {
					username: post.author.username,
					bio: post.author.bio,
					image: post.author.image
				},
				isFavorite: false,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt
			}
		} else {
			const favorites = await Favorite.find({ user: ctx.user.id })
			const isFavorite = favorites.some(
				favorite => favorite.post.toString() === post._id.toString()
			)
			ctx.body = {
				id: post._id.toString(),
				title: post.title,
				description: post.description,
				body: post.body,
				tags: post.tags,
				author: {
					username: post.author.username,
					bio: post.author.bio,
					image: post.author.image
				},
				isFavorite,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt
			}
		}
	}

	// 收藏文章
	async favorite(ctx) {
		const { id } = ctx.params
		const loginUser = ctx.user

		// 查询文章是否存在
		const post = await Post.findById(id).populate('author')

		if (!post) {
			ctx.throw(404, { message: '文章不存在' })
		}

		// 查询是否已经收藏
		const favorite = await Favorite.findOne({ user: loginUser.id, post: id })

		if (favorite) {
			ctx.throw(409, { message: '文章已收藏' })
		}

		// 收藏文章
		await Favorite.create({ post: id, user: loginUser.id })

		ctx.body = {
			id: post._id.toString(),
			title: post.title,
			description: post.description,
			body: post.body,
			tags: post.tags,
			author: {
				username: post.author.username,
				bio: post.author.bio,
				image: post.author.image
			},
			isFavorite: true,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt
		}
	}

	// 取消收藏文章
	async unfavorite(ctx) {
		const { id } = ctx.params
		const loginUser = ctx.user

		// 查询文章是否存在
		const post = await Post.findById(id).populate('author')

		if (!post) {
			ctx.throw(404, { message: '文章不存在' })
		}

		// 查询是否已经收藏
		const favorite = await Favorite.findOne({ user: loginUser.id, post: id })

		if (!favorite) {
			ctx.throw(409, { message: '文章未收藏' })
		}

		// 取消收藏文章
		await Favorite.findByIdAndRemove(favorite._id)

		ctx.body = {
			id: post._id.toString(),
			title: post.title,
			description: post.description,
			body: post.body,
			tags: post.tags,
			author: {
				username: post.author.username,
				bio: post.author.bio,
				image: post.author.image
			},
			isFavorite: false,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt
		}
	}

	// 查询所有标签
	async findAllTags(ctx) {
		const tags = await Post.find().distinct('tags').exec()

		ctx.body = tags
	}

	// 查询所有标签文章
	async findAllTagPosts(ctx) {
		const { tag } = ctx.params

		const posts = await Post.find({ tags: tag })

		ctx.body = posts
	}
}

module.exports = new PostController()
