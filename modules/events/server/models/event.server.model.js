'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Event name',
		trim: true
	},
	description: {
		type: String
	},
	eventDate: {
		type: Date
	},
	location: {
		venue: {
			type: String,
			trim: true
		},
		town: {
			type: String,
			trim: true
		},
		province: {
			type: String,
			trim: true
		}
	},
	races: [
		{
			distance: {
				type: String
			},
			time: {
				type: String
			}
		}
	],
	imageUrl: {
		type: String,
		default: 'modules/events/img/uploads/default.jpg'
	},
	link: {
		type: String,
		default: 'event.list'
	},
	sponsors: [
		{
			name: {
				type: String
			},
			sponsorImageUrl: {
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

mongoose.model('Event', EventSchema);