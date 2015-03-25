'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Ad = mongoose.model('Ad'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Ad
 */
exports.create = function(req, res) {
	var ad = new Ad(req.body);
	ad.user = req.user;

	ad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ad);
		}
	});
};

/**
 * Show the current Ad
 */
exports.read = function(req, res) {
	res.jsonp(req.ad);
};

/**
 * Update a Ad
 */
exports.update = function(req, res) {
	var ad = req.ad ;

	ad = _.extend(ad , req.body);

	ad.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ad);
		}
	});
};

/**
 * Delete an Ad
 */
exports.delete = function(req, res) {
	var ad = req.ad ;

	ad.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ad);
		}
	});
};

/**
 * List of Ads
 */
exports.list = function(req, res) { Ad.find().sort('-created').populate('user', 'displayName').exec(function(err, ads) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ads);
		}
	});
};

/**
 * Ad middleware
 */
exports.adByID = function(req, res, next, id) { Ad.findById(id).populate('user', 'displayName').exec(function(err, ad) {
		if (err) return next(err);
		if (! ad) return next(new Error('Failed to load Ad ' + id));
		req.ad = ad ;
		next();
	});
};