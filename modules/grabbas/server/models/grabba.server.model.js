'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grabba Schema
 */
var GrabbaSchema = new Schema({
	title: {
		type: String
	},
	sub: {
		type: String
	},
	description: {
		type: String
	},
	price: {
		type: String
	},
	imageUrl: {
		type: String,
		default: 'modules/grabbas/img/uploads/default.jpg'
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

mongoose.model('Grabba', GrabbaSchema);