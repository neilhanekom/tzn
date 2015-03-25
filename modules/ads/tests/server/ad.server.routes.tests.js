'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ad = mongoose.model('Ad'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, ad;

/**
 * Ad routes tests
 */
describe('Ad CRUD tests', function() {
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

		// Save a user to the test db and create new Ad
		user.save(function() {
			ad = {
				name: 'Ad Name'
			};

			done();
		});
	});

	it('should be able to save Ad instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ad
				agent.post('/api/ads')
					.send(ad)
					.expect(200)
					.end(function(adSaveErr, adSaveRes) {
						// Handle Ad save error
						if (adSaveErr) done(adSaveErr);

						// Get a list of Ads
						agent.get('/api/ads')
							.end(function(adsGetErr, adsGetRes) {
								// Handle Ad save error
								if (adsGetErr) done(adsGetErr);

								// Get Ads list
								var ads = adsGetRes.body;

								// Set assertions
								(ads[0].user._id).should.equal(userId);
								(ads[0].name).should.match('Ad Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ad instance if not logged in', function(done) {
		agent.post('/api/ads')
			.send(ad)
			.expect(403)
			.end(function(adSaveErr, adSaveRes) {
				// Call the assertion callback
				done(adSaveErr);
			});
	});

	it('should not be able to save Ad instance if no name is provided', function(done) {
		// Invalidate name field
		ad.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ad
				agent.post('/api/ads')
					.send(ad)
					.expect(400)
					.end(function(adSaveErr, adSaveRes) {
						// Set message assertion
						(adSaveRes.body.message).should.match('Please fill Ad name');
						
						// Handle Ad save error
						done(adSaveErr);
					});
			});
	});

	it('should be able to update Ad instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ad
				agent.post('/api/ads')
					.send(ad)
					.expect(200)
					.end(function(adSaveErr, adSaveRes) {
						// Handle Ad save error
						if (adSaveErr) done(adSaveErr);

						// Update Ad name
						ad.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ad
						agent.put('/api/ads/' + adSaveRes.body._id)
							.send(ad)
							.expect(200)
							.end(function(adUpdateErr, adUpdateRes) {
								// Handle Ad update error
								if (adUpdateErr) done(adUpdateErr);

								// Set assertions
								(adUpdateRes.body._id).should.equal(adSaveRes.body._id);
								(adUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ads if not signed in', function(done) {
		// Create new Ad model instance
		var adObj = new Ad(ad);

		// Save the Ad
		adObj.save(function() {
			// Request Ads
			request(app).get('/api/ads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ad if not signed in', function(done) {
		// Create new Ad model instance
		var adObj = new Ad(ad);

		// Save the Ad
		adObj.save(function() {
			request(app).get('/api/ads/' + adObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ad.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ad instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ad
				agent.post('/api/ads')
					.send(ad)
					.expect(200)
					.end(function(adSaveErr, adSaveRes) {
						// Handle Ad save error
						if (adSaveErr) done(adSaveErr);

						// Delete existing Ad
						agent.delete('/api/ads/' + adSaveRes.body._id)
							.send(ad)
							.expect(200)
							.end(function(adDeleteErr, adDeleteRes) {
								// Handle Ad error error
								if (adDeleteErr) done(adDeleteErr);

								// Set assertions
								(adDeleteRes.body._id).should.equal(adSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ad instance if not signed in', function(done) {
		// Set Ad user 
		ad.user = user;

		// Create new Ad model instance
		var adObj = new Ad(ad);

		// Save the Ad
		adObj.save(function() {
			// Try deleting Ad
			request(app).delete('/api/ads/' + adObj._id)
			.expect(403)
			.end(function(adDeleteErr, adDeleteRes) {
				// Set message assertion
				(adDeleteRes.body.message).should.match('User is not authorized');

				// Handle Ad error error
				done(adDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Ad.remove().exec(function(){
				done();
			});
		});
	});
});
