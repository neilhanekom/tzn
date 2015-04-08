'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Grabba = mongoose.model('Grabba'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Grabba
 */
exports.create = function(req, res) {
	var user = req.user;
	var message = null;


	
	// Unstringify and compile new Object
	var address = JSON.parse(req.body.address);
	var price = JSON.parse(req.body.price);
	var endDate = JSON.parse(req.body.endDate);

	console.log(req.body);

	var newObj = {
		title: req.body.title,
		sub: req.body.sub,
		description: req.body.description,
		address: address,
		endDate: endDate,
		price: price
	};

	console.log(newObj);

	if (user) {
		fs.writeFile('./modules/grabbas/client/img/uploads/' + req.files.grabbaForm.name, req.files.grabbaForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for Event'
				});
			} else {
				// var imagePath = 'modules/events/img/uploads/' + req.files.eventsForm.name;

				var grabba = new Grabba(newObj);
				// Adding and Correcting some Stringified Fields
				grabba.user = req.user;
				grabba.imageUrl = 'modules/grabbas/img/uploads/' + req.files.grabbaForm.name;
				// event.eventDate = eventDate;

				console.log(grabba);
				
				grabba.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(grabba);
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
 * Show the current Grabba
 */
exports.read = function(req, res) {
	res.jsonp(req.grabba);
};

/**
 * Update a Grabba
 */
exports.update = function(req, res) {
	var grabba = req.grabba ;

	

	grabba = _.extend(grabba , req.body);

	grabba.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grabba);
		}
	});
};

exports.updateFile = function(req, res) {
	var grabba = req.grabba ;
	var user = req.user;
	var message = null;
	var oldFile = grabba.imageUrl;

	// Unstringify and compile new Object
	var address = JSON.parse(req.body.address);
	var price = JSON.parse(req.body.price);
	var endDate = JSON.parse(req.body.endDate);


	var newObj = {
		title: req.body.title,
		sub: req.body.sub,
		description: req.body.description,
		address: address,
		endDate: endDate,
		price: price
	};


	if (user) {
		fs.writeFile('./modules/grabbas/client/img/uploads/' + req.files.grabbaForm.name, req.files.grabbaForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for Event'
				});
			} else {
				// var imagePath = 'modules/events/img/uploads/' + req.files.eventsForm.name;

				grabba = _.extend(grabba , newObj);
				// Adding and Correcting some Stringified Fields
				grabba.user = req.user;
				grabba.imageUrl = 'modules/grabbas/img/uploads/' + req.files.grabbaForm.name;
				// event.eventDate = eventDate;

				console.log(grabba);
				
				grabba.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(grabba);
						var filename = oldFile.split('/').pop();
                         var checkedFile = fs.readFileSync('./modules/grabbas/client/img/uploads/' + filename);
                         if (checkedFile) { 
                             fs.unlink( './modules/grabbas/client/img/uploads/' + filename, function (err) {
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
 * Delete an Grabba
 */
exports.delete = function(req, res) {
	var grabba = req.grabba ;

	grabba.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grabba);
		}
	});
};

/**
 * List of Grabbas
 */
exports.list = function(req, res) { Grabba.find().sort('-created').populate('user', 'displayName').exec(function(err, grabbas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grabbas);
		}
	});
};

/**
 * Grabba middleware
 */
exports.grabbaByID = function(req, res, next, id) { Grabba.findById(id).populate('user', 'displayName').exec(function(err, grabba) {
		if (err) return next(err);
		if (! grabba) return next(new Error('Failed to load Grabba ' + id));
		req.grabba = grabba ;
		next();
	});
};