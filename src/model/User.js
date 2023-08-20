const mongoose = require('@app/db')
const { Schema, model } = mongoose

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		},
		bio: {
			type: String
		},
		image: {
			type: String
		},
		following: {
			type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
			select: false
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

module.exports = model('User', userSchema)
