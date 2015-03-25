'use strict';

module.exports = function(app) {
	var sponsors = require('../controllers/sponsors.server.controller');
	var sponsorsPolicy = require('../policies/sponsors.server.policy');

	// Sponsors Routes
	app.route('/api/sponsors').all()
		.get(sponsors.list).all(sponsorsPolicy.isAllowed)
		.post(sponsors.create);

	app.route('/api/sponsors/:sponsorId').all(sponsorsPolicy.isAllowed)
		.get(sponsors.read)
		.put(sponsors.update)
		.delete(sponsors.delete);

	// Finish by binding the Sponsor middleware
	app.param('sponsorId', sponsors.sponsorByID);
};