'use strict';

module.exports = function(app) {
	var lefts = require('../controllers/lefts.server.controller');
	var leftsPolicy = require('../policies/lefts.server.policy');

	// Lefts Routes
	app.route('/api/lefts').all()
		.get(lefts.list).all(leftsPolicy.isAllowed)
		.post(lefts.create);

	app.route('/api/lefts/:leftId').all(leftsPolicy.isAllowed)
		.get(lefts.read)
		.put(lefts.update)
		.delete(lefts.delete);

	// Finish by binding the Left middleware
	app.param('leftId', lefts.leftByID);
};