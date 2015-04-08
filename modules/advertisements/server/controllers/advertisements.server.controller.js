'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Advertisement = mongoose.model('Advertisement'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Advertisement
 */
exports.create = function(req, res) {
	var user = req.user;
	var message = null;
	
	// Unstringify and compile new Object
	var specifications = JSON.parse(req.body.specifications);
	var sponsors = JSON.parse(req.body.sponsors);

	var newObj = {
		type: req.body.type,
		title: req.body.title,
		description: req.body.description,
		specifications: specifications,
		sponsors: sponsors
	};

	console.log(newObj);
	
	if (user) {
		fs.writeFile('./modules/advertisements/client/img/uploads/' + req.files.advertisementForm.name, req.files.advertisementForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for advertisement'
				});
			} else {
				// var imagePath = 'modules/advertisements/img/uploads/' + req.files.advertisementsForm.name;

				var advertisement = new Advertisement(newObj);
				// Adding and Correcting some Stringified Fields
				advertisement.user = req.user;
				advertisement.imageUrl = 'modules/advertisements/img/uploads/' + req.files.advertisementForm.name;
				advertisement.link = req.body.type + 's';
				// advertisement.advertisementDate = advertisementDate;

				console.log(advertisement);
				
				advertisement.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(advertisement);
					}
				});

				
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Show the current Advertisement
 */
exports.read = function(req, res) {
	res.jsonp(req.advertisement);
};

/**
 * Update a Advertisement
 */
exports.update = function(req, res) {
	var advertisement = req.advertisement ;

	advertisement = _.extend(advertisement , req.body);

	advertisement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(advertisement);
		}
	});
};

exports.updateFile = function(req, res) {
	var advertisement = req.advertisement ;
	var user = req.user;
	var message = null;
	var oldFile = advertisement.imageUrl;
	
	
	// Unstringify and compile new Object
	var specifications = JSON.parse(req.body.specifications);
	var sponsors = JSON.parse(req.body.sponsors);

	var newObj = {
		type: req.body.type,
		title: req.body.title,
		description: req.body.description,
		specifications: specifications,
		sponsors: sponsors
	};

	
	if (user) {
		fs.writeFile('./modules/advertisements/client/img/uploads/' + req.files.advertisementForm.name, req.files.advertisementForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for advertisement'
				});
			} else {
				// var imagePath = 'modules/advertisements/img/uploads/' + req.files.advertisementsForm.name;

				advertisement = _.extend(advertisement , newObj);
				// Adding and Correcting some Stringified Fields
				advertisement.user = req.user;
				advertisement.imageUrl = 'modules/advertisements/img/uploads/' + req.files.advertisementForm.name;
				advertisement.link = req.body.type + 's';
				// advertisement.advertisementDate = advertisementDate;

				console.log(advertisement);
				
				advertisement.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(advertisement);
						var filename = oldFile.split('/').pop();
                         var checkedFile = fs.readFileSync('./modules/advertisements/client/img/uploads/' + filename);
                         if (checkedFile) { 
                             fs.unlink( './modules/advertisements/client/img/uploads/' + filename, function (err) {
                           if (err) throw err;
                             }); 
                         } else {
                             return;
                         }
					}
				});

				
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Delete an Advertisement
 */
exports.delete = function(req, res) {
	var advertisement = req.advertisement ;

	advertisement.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(advertisement);
		}
	});
};

/**
 * List of Advertisements
 */
exports.list = function(req, res) { Advertisement.find().sort('-created').populate('user', 'displayName').exec(function(err, advertisements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(advertisements);
		}
	});
};

/**
 * Advertisement middleware
 */
exports.advertisementByID = function(req, res, next, id) { Advertisement.findById(id).populate('user', 'displayName').exec(function(err, advertisement) {
		if (err) return next(err);
		if (! advertisement) return next(new Error('Failed to load Advertisement ' + id));
		req.advertisement = advertisement ;
		next();
	});
};