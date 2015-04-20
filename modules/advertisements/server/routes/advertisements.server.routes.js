'use strict';

module.exports = function(app) {
	var advertisements = require('../controllers/advertisements.server.controller');
	var advertisementsPolicy = require('../policies/advertisements.server.policy');

	// Advertisements Routes
	app.route('/api/advertisements').all()
		.get(advertisements.list).all(advertisementsPolicy.isAllowed)
		.post(advertisements.create);

	app.route('/api/advertisements/:advertisementId')
		.get(advertisements.read)
		.put(advertisements.update)
		.delete(advertisements.delete);

	app.route('/api/advertisements/updatefile/:advertisementId')
		.put(advertisements.updateFile);

	// Finish by binding the Advertisement middleware
	app.param('advertisementId', advertisements.advertisementByID);
};