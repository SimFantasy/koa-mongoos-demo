const mongoose = require('@app/db')
const { Schema, model } = mongoose

const favoriteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	post: {
		type: Schema.Types.ObjectId,
		ref: 'Post',
		required: true
	},
	__v: {
		type: Number,
		select: false
	}
})

module.exports = model('Favorite', favoriteSchema)
