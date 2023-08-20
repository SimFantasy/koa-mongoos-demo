const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const dotenv = require('dotenv')
const useRoutes = require('@router')
require('@app/db')

dotenv.config()

const app = new Koa()

app.use(
	error({
		postFormat: (e, { stack, ...rest }) =>
			process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
	})
)

app.use(bodyparser())

useRoutes(app)

module.exports = app
