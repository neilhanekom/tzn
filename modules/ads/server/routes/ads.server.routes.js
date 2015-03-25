'use strict';

module.exports = function(app) {
	var ads = require('../controllers/ads.server.controller');
	var adsPolicy = require('../policies/ads.server.policy');

	// Ads Routes
	app.route('/api/ads').all()
		.get(ads.list).all(adsPolicy.isAllowed)
		.post(ads.create);

	app.route('/api/ads/:adId').all(adsPolicy.isAllowed)
		.get(ads.read)
		.put(ads.update)
		.delete(ads.delete);

	// Finish by binding the Ad middleware
	app.param('adId', ads.adByID);
};