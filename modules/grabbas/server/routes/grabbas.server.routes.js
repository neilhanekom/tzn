'use strict';

module.exports = function(app) {
	var grabbas = require('../controllers/grabbas.server.controller');
	var grabbasPolicy = require('../policies/grabbas.server.policy');

	// Grabbas Routes
	app.route('/api/grabbas')
		.get(grabbas.list)
		.post(grabbas.create);

	app.route('/api/grabbas/:grabbaId')
		.get(grabbas.read)
		.put(grabbas.update)
		.delete(grabbas.delete);

	app.route('/api/grabbas/updatefile/:grabbaId')
		.put(grabbas.updateFile);

	// Finish by binding the Grabba middleware
	app.param('grabbaId', grabbas.grabbaByID);
};