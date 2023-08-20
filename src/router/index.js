const fs = require('fs')

const useRoutes = app => {
	const files = fs.readdirSync(__dirname)

	for (const file of files) {
		if (file === 'index.js') continue
		const router = require(`./${file}`)
		app.use(router.routes())
		app.use(router.allowedMethods())
	}
}

module.exports = useRoutes
