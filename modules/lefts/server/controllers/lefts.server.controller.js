'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Left = mongoose.model('Left'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Left
 */
exports.create = function(req, res) {
	var left = new Left(req.body);
	left.user = req.user;

	left.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(left);
		}
	});
};

/**
 * Show the current Left
 */
exports.read = function(req, res) {
	res.jsonp(req.left);
};

/**
 * Update a Left
 */
exports.update = function(req, res) {
	var left = req.left ;

	left = _.extend(left , req.body);

	left.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(left);
		}
	});
};

/**
 * Delete an Left
 */
exports.delete = function(req, res) {
	var left = req.left ;

	left.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(left);
		}
	});
};

/**
 * List of Lefts
 */
exports.list = function(req, res) { Left.find().sort('-created').populate('user', 'displayName').exec(function(err, lefts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(lefts);
		}
	});
};

/**
 * Left middleware
 */
exports.leftByID = function(req, res, next, id) { Left.findById(id).populate('user', 'displayName').exec(function(err, left) {
		if (err) return next(err);
		if (! left) return next(new Error('Failed to load Left ' + id));
		req.left = left ;
		next();
	});
};