const jwt = require('jsonwebtoken')

exports.jwtSign = user => {
	const token = jwt.sign(
		{
			id: user.id,
			username: user.username,
			email: user.email
		},
		process.env.JWT_SECRET,
		{ expiresIn: '7d' }
	)

	return token
}

exports.jwtVerify = token => {
	const decoded = jwt.verify(token, process.env.JWT_SECRET)

	return decoded
}
