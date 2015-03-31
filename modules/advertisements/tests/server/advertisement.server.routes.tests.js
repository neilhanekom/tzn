'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Advertisement = mongoose.model('Advertisement'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, advertisement;

/**
 * Advertisement routes tests
 */
describe('Advertisement CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Advertisement
		user.save(function() {
			advertisement = {
				name: 'Advertisement Name'
			};

			done();
		});
	});

	it('should be able to save Advertisement instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advertisement
				agent.post('/api/advertisements')
					.send(advertisement)
					.expect(200)
					.end(function(advertisementSaveErr, advertisementSaveRes) {
						// Handle Advertisement save error
						if (advertisementSaveErr) done(advertisementSaveErr);

						// Get a list of Advertisements
						agent.get('/api/advertisements')
							.end(function(advertisementsGetErr, advertisementsGetRes) {
								// Handle Advertisement save error
								if (advertisementsGetErr) done(advertisementsGetErr);

								// Get Advertisements list
								var advertisements = advertisementsGetRes.body;

								// Set assertions
								(advertisements[0].user._id).should.equal(userId);
								(advertisements[0].name).should.match('Advertisement Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Advertisement instance if not logged in', function(done) {
		agent.post('/api/advertisements')
			.send(advertisement)
			.expect(403)
			.end(function(advertisementSaveErr, advertisementSaveRes) {
				// Call the assertion callback
				done(advertisementSaveErr);
			});
	});

	it('should not be able to save Advertisement instance if no name is provided', function(done) {
		// Invalidate name field
		advertisement.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advertisement
				agent.post('/api/advertisements')
					.send(advertisement)
					.expect(400)
					.end(function(advertisementSaveErr, advertisementSaveRes) {
						// Set message assertion
						(advertisementSaveRes.body.message).should.match('Please fill Advertisement name');
						
						// Handle Advertisement save error
						done(advertisementSaveErr);
					});
			});
	});

	it('should be able to update Advertisement instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advertisement
				agent.post('/api/advertisements')
					.send(advertisement)
					.expect(200)
					.end(function(advertisementSaveErr, advertisementSaveRes) {
						// Handle Advertisement save error
						if (advertisementSaveErr) done(advertisementSaveErr);

						// Update Advertisement name
						advertisement.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Advertisement
						agent.put('/api/advertisements/' + advertisementSaveRes.body._id)
							.send(advertisement)
							.expect(200)
							.end(function(advertisementUpdateErr, advertisementUpdateRes) {
								// Handle Advertisement update error
								if (advertisementUpdateErr) done(advertisementUpdateErr);

								// Set assertions
								(advertisementUpdateRes.body._id).should.equal(advertisementSaveRes.body._id);
								(advertisementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Advertisements if not signed in', function(done) {
		// Create new Advertisement model instance
		var advertisementObj = new Advertisement(advertisement);

		// Save the Advertisement
		advertisementObj.save(function() {
			// Request Advertisements
			request(app).get('/api/advertisements')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Advertisement if not signed in', function(done) {
		// Create new Advertisement model instance
		var advertisementObj = new Advertisement(advertisement);

		// Save the Advertisement
		advertisementObj.save(function() {
			request(app).get('/api/advertisements/' + advertisementObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', advertisement.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Advertisement instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Advertisement
				agent.post('/api/advertisements')
					.send(advertisement)
					.expect(200)
					.end(function(advertisementSaveErr, advertisementSaveRes) {
						// Handle Advertisement save error
						if (advertisementSaveErr) done(advertisementSaveErr);

						// Delete existing Advertisement
						agent.delete('/api/advertisements/' + advertisementSaveRes.body._id)
							.send(advertisement)
							.expect(200)
							.end(function(advertisementDeleteErr, advertisementDeleteRes) {
								// Handle Advertisement error error
								if (advertisementDeleteErr) done(advertisementDeleteErr);

								// Set assertions
								(advertisementDeleteRes.body._id).should.equal(advertisementSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Advertisement instance if not signed in', function(done) {
		// Set Advertisement user 
		advertisement.user = user;

		// Create new Advertisement model instance
		var advertisementObj = new Advertisement(advertisement);

		// Save the Advertisement
		advertisementObj.save(function() {
			// Try deleting Advertisement
			request(app).delete('/api/advertisements/' + advertisementObj._id)
			.expect(403)
			.end(function(advertisementDeleteErr, advertisementDeleteRes) {
				// Set message assertion
				(advertisementDeleteRes.body.message).should.match('User is not authorized');

				// Handle Advertisement error error
				done(advertisementDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Advertisement.remove().exec(function(){
				done();
			});
		});
	});
});
