'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Partner Schema
 */
var PartnerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Partner name',
		trim: true
	},
	slogan: {
		type: String
	},
	description: {
		type: String
	},
	address: {
		line1: {
			type: String,
			trim: true
		},
		line2: {
			type: String,
			trim: true
		},
		town: {
			type: String,
			trim: true
		},
		city: {
			type: String,
			trim: true
		},
		province: {
			type: String,
			trim: true
		},
		code: {
			type: String,
			trim: true
		}
	},
	contacts: [
		{
			name: {
				type: String
			},
			number: {
				type: String
			},
			email: {
				type: String
			}
		}
	],
	imageUrl: {
		type: String,
		default: 'modules/partners/img/uploads/default.jpg'
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

mongoose.model('Partner', PartnerSchema);