'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Advertisement Schema
 */
var AdvertisementSchema = new Schema({
	title: {
		type: String
	},
	description: {
		type: String
	},
	specifications: [
		{
			key: {
				type: String
			},
			value: {
				type: String
			}
		}
	],
	link: {
		type: String
	},
	imageUrl: {
		type: String,
		default: 'modules/ads/img/default.png'
	},
	type: {
		type: String
	},
	sponsors: [
		{
			name: {
				type: String
			},
			imageUrl: {
				type: String
			}
		}
	],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Advertisement', AdvertisementSchema);