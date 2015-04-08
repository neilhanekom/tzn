'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Event = mongoose.model('Event'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a Event
 */
exports.create = function(req, res) {
	var user = req.user;
	// var message = null;
	console.log(req.body);
	// Unstringify and compile new Object
	var location = JSON.parse(req.body.location);
	var eventDate = JSON.parse(req.body.eventDate);
	var races = JSON.parse(req.body.races);

	var newObj = {
		name: req.body.name,
		description: req.body.description,
		eventDate: eventDate,
		location: location,
		races: races
	};

	
	if (user) {
		fs.writeFile('./modules/events/client/img/uploads/' + req.files.eventsForm.name, req.files.eventsForm.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading Image for Event'
				});
			} else {
				// var imagePath = 'modules/events/img/uploads/' + req.files.eventsForm.name;

				var event = new Event(newObj);
				// Adding and Correcting some Stringified Fields
				event.user = req.user;
				event.imageUrl = 'modules/events/img/uploads/' + req.files.eventsForm.name;
				// event.eventDate = eventDate;

				console.log(event);
				
				event.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(event);
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
 * Show the current Event
 */
exports.read = function(req, res) {
	res.jsonp(req.event);
};

/**
 * Update a Event
 */


exports.update = function(req, res) {

		var event = req.event ;

		event = _.extend(event , req.body);

		event.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(event);
			}
		});

};

exports.updateFile = function(req, res) {

		        var event = req.event;
        var user = req.user;
        var message = null;
        var oldFile = event.imageUrl;

        var location = JSON.parse(req.body.location);
        var eventDate = JSON.parse(req.body.eventDate);
        var races = JSON.parse(req.body.races);

        var newObj = {
         name: req.body.name,
         description: req.body.description,
         eventDate: eventDate,
         location: location,
         races: races
        };

        console.log(newObj);
        
            fs.writeFile('./modules/events/client/img/uploads/' + req.files.eventsForm.name, req.files.eventsForm.buffer, function (uploadError) {
             if (uploadError) {
                 return res.status(400).send({
                     message: 'Error occurred while uploading Image for Event'
                 });
             } else {
                 // var imagePath = 'modules/events/img/uploads/' + req.files.eventsForm.name;

                 event = _.extend(event , newObj);
                 // Adding and Correcting some Stringified Fields
                 event.user = req.user;
                 event.imageUrl = 'modules/events/img/uploads/' + req.files.eventsForm.name;
                 // event.eventDate = eventDate;

                    
                    
                 event.save(function(err) {
                     if (err) {
                         return res.status(400).send({
                             message: errorHandler.getErrorMessage(err)
                         });
                     } else {
                         res.jsonp(event);
                         var filename = oldFile.split('/').pop();
                         var checkedFile = fs.readFileSync('./modules/events/client/img/uploads/' + filename);
                         if (checkedFile) { 
                             fs.unlink( './modules/events/client/img/uploads/' + filename, function (err) {
                           if (err) throw err;
                             }); 
                         } else {
                             return;
                         }
                     }
                 });

                    
             }
            });

};

/**
 * Delete an Event
 */
exports.delete = function(req, res) {
	var event = req.event ;

	event.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(event);
		}
	});
};

/**
 * List of Events
 */
exports.list = function(req, res) { Event.find().sort('-created').populate('user', 'displayName').exec(function(err, events) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(events);
		}
	});
};

/**
 * Event middleware
 */
exports.eventByID = function(req, res, next, id) { Event.findById(id).populate('user', 'displayName').exec(function(err, event) {
		if (err) return next(err);
		if (! event) return next(new Error('Failed to load Event ' + id));
		req.event = event ;
		next();
	});
};