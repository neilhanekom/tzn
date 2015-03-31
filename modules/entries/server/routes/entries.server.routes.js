'use strict';

module.exports = function(app) {
	var entries = require('../controllers/entries.server.controller');
	var entriesPolicy = require('../policies/entries.server.policy');

	// Entries Routes
	app.route('/api/entries').all()
		.get(entries.list)
		.post(entries.create);

	app.route('/api/entries/compile')
		.post(entries.compile);	

	app.route('/api/entries/:entryId')
		.get(entries.read)
		.put(entries.update)
		.delete(entries.delete);

	// Finish by binding the Entry middleware
	app.param('entryId', entries.entryByID);
};

//.all(entriesPolicy.isAllowed)