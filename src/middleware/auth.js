const { jwtVerify } = require('@utils/handleJwt')

module.exports = (required = true) => {
	return async (ctx, next) => {
		const { authorization = '' } = ctx.request.header

		if (!authorization) {
			if (required) {
				ctx.throw(401, { message: '请先登录' })
			} else {
				await next()
			}
		} else {
			try {
				const token = authorization.replace('Bearer ', '')
				const user = jwtVerify(token)

				ctx.user = user
				await next()
			} catch (err) {
				console.log('err: ', err)
				ctx.throw(401, { message: err || 'token无效' })
			}
		}
	}
}
