'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Entry Schema
 */
var EntrySchema = new Schema({
	title: {
		type: String,
		trim: true
	},
	gender: {
		type: String,
		trim: true
	},
	firstName: {
		type: String,
		trim: true
	},
	lastName: {
		type: String,
		trim: true
	},
	rsaId: {
		type: String,
		trim: true
	},
	birthDate: {
 		type: Date
	},
	mobileNumber: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	postal: {
		box: {
			type: String,
			trim: true
		},
		town: {
			type: String,
			trim: true
		},
		code: {
			type: Number
		}
	},
	emergency: {
		person: {
			type: String,
			trim: true
		},
		contact: {
			type: String,
			trim: true
		},
		relationship: {
			type: String,
			trim: true
		}
	},
	medical: {
		main: {
			type: String,
			trim: true
		},
		company: {
			type: String,
			trim: true
		},
		number: {
			type: String,
			trim: true
		},
		plan: {
			type: String,
			trim: true
		},
		conditions: {
			type: String
		},
		doctorName: {
			type: String,
			trim: true
		},
		doctorNumber: {
			type: String,
			trim: true
		}
	},
	club: {
		name: {

		},
		province: {

		}
	},
	license: {
		exist: {
			type: String,
			default: 'no'
		},
		number: {

		}
	},
	fee: {
		type: Number
	},
	status: {
		type: [{
			type: String,
			enum: ['unpaid', 'complete']
		}],
		default: ['unpaid']
	},
	age_cat: {
		type: String,
		trim: true
	},
	race: {
		type: String,
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

mongoose.model('Entry', EntrySchema);