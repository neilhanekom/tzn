'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Contact = mongoose.model('Contact'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Contact
 */
exports.create = function(req, res) {
	// var contact = new Contact(req.body);
	// contact.user = req.user;

	// contact.save(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(contact);
	// 	}
	// });
	
	var user = req.user;
	var message = null;


	if (user) {
		fs.writeFile('./modules/contacts/client/img/uploads/' + req.files.contactForm.name, req.files.contactForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for Event'
				});
			} else {
				// var imagePath = 'modules/events/img/uploads/' + req.files.eventsForm.name;

				var contact = new Contact(req.body);
				// Adding and Correcting some Stringified Fields
				contact.user = req.user;
				contact.imageUrl = 'modules/contacts/img/uploads/' + req.files.contactForm.name;
				// event.eventDate = eventDate;

				console.log(contact);
				
				contact.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(contact);
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
 * Show the current Contact
 */
exports.read = function(req, res) {
	res.jsonp(req.contact);
};

/**
 * Update a Contact
 */
exports.update = function(req, res) {
	var contact = req.contact ;

	contact = _.extend(contact , req.body);

	contact.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contact);
		}
	});
};

exports.updateFile = function(req, res) {
	var contact = req.contact ;
	var user = req.user;
	var message = null;
	var oldFile = contact.imageUrl;


	if (user) {
		fs.writeFile('./modules/contacts/client/img/uploads/' + req.files.contactForm.name, req.files.contactForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for Event'
				});
			} else {
				// var imagePath = 'modules/events/img/uploads/' + req.files.eventsForm.name;

				contact = _.extend(contact , req.body);
				// Adding and Correcting some Stringified Fields
				contact.user = req.user;
				contact.imageUrl = 'modules/contacts/img/uploads/' + req.files.contactForm.name;
				// event.eventDate = eventDate;

				console.log(contact);
				
				contact.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(contact);
						var filename = oldFile.split('/').pop();
                         var checkedFile = fs.readFileSync('./modules/contacts/client/img/uploads/' + filename);
                         if (checkedFile) { 
                             fs.unlink( './modules/contacts/client/img/uploads/' + filename, function (err) {
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
 * Delete an Contact
 */
exports.delete = function(req, res) {
	var contact = req.contact ;

	contact.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contact);
		}
	});
};

/**
 * List of Contacts
 */
exports.list = function(req, res) { Contact.find().sort('-created').populate('user', 'displayName').exec(function(err, contacts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(contacts);
		}
	});
};

/**
 * Contact middleware
 */
exports.contactByID = function(req, res, next, id) { Contact.findById(id).populate('user', 'displayName').exec(function(err, contact) {
		if (err) return next(err);
		if (! contact) return next(new Error('Failed to load Contact ' + id));
		req.contact = contact ;
		next();
	});
};