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
	address: {
		line1: {
			type: String
		},
		line2: {
			type: String
		}
	},
	price: {
		type: String
	},
	endDate: {
		type: Date
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