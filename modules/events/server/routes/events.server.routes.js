'use strict';

module.exports = function(app) {
	var events = require('../controllers/events.server.controller');
	var eventsPolicy = require('../policies/events.server.policy');

	// Events Routes
	app.route('/api/events').all()
		.get(events.list).all(eventsPolicy.isAllowed)
		.post(events.create);

	app.route('/api/events/:eventId')
		.get(events.read)
		.put(events.update)
		.delete(events.delete);
	
	app.route('/api/events/updatefile/:eventId')
		.put(events.updateFile);
		

	// Finish by binding the Event middleware
	app.param('eventId', events.eventByID);
};