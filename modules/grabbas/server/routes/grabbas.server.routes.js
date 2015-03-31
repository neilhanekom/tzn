'use strict';

module.exports = function(app) {
	var grabbas = require('../controllers/grabbas.server.controller');
	var grabbasPolicy = require('../policies/grabbas.server.policy');

	// Grabbas Routes
	app.route('/api/grabbas').all()
		.get(grabbas.list).all(grabbasPolicy.isAllowed)
		.post(grabbas.create);

	app.route('/api/grabbas/:grabbaId').all(grabbasPolicy.isAllowed)
		.get(grabbas.read)
		.put(grabbas.update)
		.delete(grabbas.delete);

	// Finish by binding the Grabba middleware
	app.param('grabbaId', grabbas.grabbaByID);
};