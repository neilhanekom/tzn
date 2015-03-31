'use strict';

module.exports = function(app) {
	var partners = require('../controllers/partners.server.controller');
	var partnersPolicy = require('../policies/partners.server.policy');

	// Partners Routes
	app.route('/api/partners').all()
		.get(partners.list).all(partnersPolicy.isAllowed)
		.post(partners.create);

	app.route('/api/partners/:partnerId').all(partnersPolicy.isAllowed)
		.get(partners.read)
		.put(partners.update)
		.delete(partners.delete);

	// Finish by binding the Partner middleware
	app.param('partnerId', partners.partnerByID);
};