const mongoose = require('mongoose')

try {
	mongoose.connect('mongodb://localhost:27017/koa_mongoose_demo2')
	console.log('Mongodb connected')
} catch (error) {
	console.log('Mongodb connected failed: ', error)
}

mongoose.connection.on('error', console.error)

module.exports = mongoose
