'use strict';

var sgu   = 'TzaneenCycling';
var sgp   = 'Dorothy+1';


/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	Entry = mongoose.model('Entry'),
	sendgrid  = require('sendgrid')( sgu, sgp),
	Hogan = require('hogan.js'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a Entry
 */
exports.create = function(req, res) {
	var entry = new Entry(req.body);



	var template = fs.readFileSync('./modules/entries/server/templates/entry.hjs', 'utf-8' );
	var compiledTemplate = Hogan.compile(template);  
	var recip = req.body.email

	if (compiledTemplate ) {
 	entry.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(entry);
			console.log(entry);
			sendgrid.send({
			  to:       recip,
			  from:     'noreply@tzaneencycling.co.za',
			  subject:  'Your Entry confirmation for the Miami Magoebaskloof Classic',
			  html:     compiledTemplate.render({
			  				firstName: entry.firstName,
			  				lastName: entry.lastName,
			  				entry_id: entry._id,
			  				fee: entry.fee
			  			})
			}, function(err, json) {
			  if (err) { return console.error(err); }
			  console.log(json);
			});
		}
	});
	
	}
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
	console.log(entry);
	var template = fs.readFileSync('./modules/entries/server/templates/confirmation.hjs', 'utf-8' );
	var compiledTemplate = Hogan.compile(template);  
	var recip = entry.email;

	console.log(recip);

	entry.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(entry);
			sendgrid.send({
			  to:       recip,
			  from:     'noreply@tzaneencycling.co.za',
			  subject:  'Entry Payment confirmed for the Miami Magoebaskloof Classic',
			  html:     compiledTemplate.render({
			  				firstName: entry.firstName,
			  				lastName: entry.lastName,
			  				entry_id: entry._id,
			  				fee: entry.fee
			  				
			  			})
			}, function(err, json) {
			  if (err) { return console.error(err); }
			  console.log(json);
			});
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