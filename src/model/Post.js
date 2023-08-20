const mongoose = require('@app/db')
const { Schema, model } = mongoose

const postSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		body: {
			type: String,
			required: true
		},
		tags: [
			{
				type: String
			}
		],
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		__v: {
			type: Number,
			select: false
		}
	},
	{
		timestamps: true
	}
)

module.exports = model('Post', postSchema)
