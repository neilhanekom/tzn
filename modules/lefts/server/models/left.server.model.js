'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Left Schema
 */
var LeftSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Left name',
		trim: true
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

mongoose.model('Left', LeftSchema);