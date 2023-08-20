const { User } = require('@model')

class UserService {
	// 使用Id查询用户
	async getUserById(id, ctx) {
		const user = await User.findById(id)

		if (!user) {
			ctx.throw(404, { message: '用户不存在' })
		}

		return user
	}

	// 查询是否关注
}

module.exports = new UserService()
