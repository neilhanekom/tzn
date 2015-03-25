'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Sponsor = mongoose.model('Sponsor'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Sponsor
 */
exports.create = function(req, res) {
	var sponsor = new Sponsor(req.body);
	sponsor.user = req.user;

	sponsor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sponsor);
		}
	});
};

/**
 * Show the current Sponsor
 */
exports.read = function(req, res) {
	res.jsonp(req.sponsor);
};

/**
 * Update a Sponsor
 */
exports.update = function(req, res) {
	var sponsor = req.sponsor ;

	sponsor = _.extend(sponsor , req.body);

	sponsor.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sponsor);
		}
	});
};

/**
 * Delete an Sponsor
 */
exports.delete = function(req, res) {
	var sponsor = req.sponsor ;

	sponsor.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sponsor);
		}
	});
};

/**
 * List of Sponsors
 */
exports.list = function(req, res) { Sponsor.find().sort('-created').populate('user', 'displayName').exec(function(err, sponsors) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sponsors);
		}
	});
};

/**
 * Sponsor middleware
 */
exports.sponsorByID = function(req, res, next, id) { Sponsor.findById(id).populate('user', 'displayName').exec(function(err, sponsor) {
		if (err) return next(err);
		if (! sponsor) return next(new Error('Failed to load Sponsor ' + id));
		req.sponsor = sponsor ;
		next();
	});
};