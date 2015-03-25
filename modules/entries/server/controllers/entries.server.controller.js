'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Entry = mongoose.model('Entry'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Entry
 */
exports.create = function(req, res) {
	var entry = new Entry(req.body);
	// entry.user = req.user;

	entry.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(entry);
		}
	});
};

/**
 * Show the current Entry
 */
exports.read = function(req, res) {
	res.jsonp(req.entry);
};

/**
 * Update a Entry
 */
exports.update = function(req, res) {
	var entry = req.entry ;

	entry = _.extend(entry , req.body);

	entry.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(entry);
		}
	});
};

/**
 * Delete an Entry
 */
exports.delete = function(req, res) {
	var entry = req.entry ;

	entry.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(entry);
		}
	});
};

/**
 * List of Entries
 */
exports.list = function(req, res) { Entry.find().sort('-created').populate('user', 'displayName').exec(function(err, entries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(entries);
		}
	});
};

/**
 * Entry middleware
 */
exports.entryByID = function(req, res, next, id) { Entry.findById(id).populate('user', 'displayName').exec(function(err, entry) {
		if (err) return next(err);
		if (! entry) return next(new Error('Failed to load Entry ' + id));
		req.entry = entry ;
		next();
	});
};