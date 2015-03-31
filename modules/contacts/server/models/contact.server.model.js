'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Contact Schema
 */
var ContactSchema = new Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	position: {
		type: String
	},
	mobileNumber: {
		type: String
	},
	telephone: {
		type: String
	},
	email: {
		type: String,
		trim: true
	},
	imageUrl: {
		type: String,
		default: 'modules/contacts/img/uploads/default.png'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Contact', ContactSchema);