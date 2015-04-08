'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Partner = mongoose.model('Partner'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Partner
 */
exports.create = function(req, res) {

	var user = req.user;
	var message = null;
	console.log(req.body);

	// Unstringify and compile new Object
	var address = JSON.parse(req.body.address);
	var contacts = JSON.parse(req.body.contacts);

	var newObj = {
		name: req.body.name,
		slogan: req.body.slogan,
		description: req.body.description,
		address: address,
		contacts: contacts
	};
	
	if (user) {
		fs.writeFile('./modules/partners/client/img/uploads/' + req.files.partnerForm.name, req.files.partnerForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for partner'
				});
			} else {
				// var imagePath = 'modules/partners/img/uploads/' + req.files.partnersForm.name;

				var partner = new Partner(newObj);
				// Adding and Correcting some Stringified Fields
				partner.user = req.user;
				partner.imageUrl = 'modules/partners/img/uploads/' + req.files.partnerForm.name;
				// partner.partnerDate = partnerDate;

				console.log(partner);
				
				partner.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(partner);
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
 * Show the current Partner
 */
exports.read = function(req, res) {
	res.jsonp(req.partner);
};

/**
 * Update a Partner
 */
exports.update = function(req, res) {
	var partner = req.partner ;

	partner = _.extend(partner , req.body);

	partner.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

exports.updateFile = function(req, res) {
	var partner = req.partner ;
	var user = req.user;
	var message = null;
	var oldFile = partner.imageUrl;
	

	// Unstringify and compile new Object
	var address = JSON.parse(req.body.address);
	var contacts = JSON.parse(req.body.contacts);

	var newObj = {
		name: req.body.name,
		slogan: req.body.slogan,
		description: req.body.description,
		address: address,
		contacts: contacts
	};
	
	if (user) {
		fs.writeFile('./modules/partners/client/img/uploads/' + req.files.partnerForm.name, req.files.partnerForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for partner'
				});
			} else {
				// var imagePath = 'modules/partners/img/uploads/' + req.files.partnersForm.name;

				partner = _.extend(partner , newObj);
				// Adding and Correcting some Stringified Fields
				partner.user = req.user;
				partner.imageUrl = 'modules/partners/img/uploads/' + req.files.partnerForm.name;
				// partner.partnerDate = partnerDate;

				console.log(partner);
				
				partner.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(partner);
						var filename = oldFile.split('/').pop();
                         var checkedFile = fs.readFileSync('./modules/partners/client/img/uploads/' + filename);
                         if (checkedFile) { 
                             fs.unlink( './modules/partners/client/img/uploads/' + filename, function (err) {
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
 * Delete an Partner
 */
exports.delete = function(req, res) {
	var partner = req.partner ;

	partner.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partner);
		}
	});
};

/**
 * List of Partners
 */
exports.list = function(req, res) { Partner.find().sort('-created').populate('user', 'displayName').exec(function(err, partners) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(partners);
		}
	});
};

/**
 * Partner middleware
 */
exports.partnerByID = function(req, res, next, id) { Partner.findById(id).populate('user', 'displayName').exec(function(err, partner) {
		if (err) return next(err);
		if (! partner) return next(new Error('Failed to load Partner ' + id));
		req.partner = partner ;
		next();
	});
};