'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Partner = mongoose.model('Partner'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, partner;

/**
 * Partner routes tests
 */
describe('Partner CRUD tests', function() {
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

		// Save a user to the test db and create new Partner
		user.save(function() {
			partner = {
				name: 'Partner Name'
			};

			done();
		});
	});

	it('should be able to save Partner instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partner
				agent.post('/api/partners')
					.send(partner)
					.expect(200)
					.end(function(partnerSaveErr, partnerSaveRes) {
						// Handle Partner save error
						if (partnerSaveErr) done(partnerSaveErr);

						// Get a list of Partners
						agent.get('/api/partners')
							.end(function(partnersGetErr, partnersGetRes) {
								// Handle Partner save error
								if (partnersGetErr) done(partnersGetErr);

								// Get Partners list
								var partners = partnersGetRes.body;

								// Set assertions
								(partners[0].user._id).should.equal(userId);
								(partners[0].name).should.match('Partner Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Partner instance if not logged in', function(done) {
		agent.post('/api/partners')
			.send(partner)
			.expect(403)
			.end(function(partnerSaveErr, partnerSaveRes) {
				// Call the assertion callback
				done(partnerSaveErr);
			});
	});

	it('should not be able to save Partner instance if no name is provided', function(done) {
		// Invalidate name field
		partner.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partner
				agent.post('/api/partners')
					.send(partner)
					.expect(400)
					.end(function(partnerSaveErr, partnerSaveRes) {
						// Set message assertion
						(partnerSaveRes.body.message).should.match('Please fill Partner name');
						
						// Handle Partner save error
						done(partnerSaveErr);
					});
			});
	});

	it('should be able to update Partner instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partner
				agent.post('/api/partners')
					.send(partner)
					.expect(200)
					.end(function(partnerSaveErr, partnerSaveRes) {
						// Handle Partner save error
						if (partnerSaveErr) done(partnerSaveErr);

						// Update Partner name
						partner.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Partner
						agent.put('/api/partners/' + partnerSaveRes.body._id)
							.send(partner)
							.expect(200)
							.end(function(partnerUpdateErr, partnerUpdateRes) {
								// Handle Partner update error
								if (partnerUpdateErr) done(partnerUpdateErr);

								// Set assertions
								(partnerUpdateRes.body._id).should.equal(partnerSaveRes.body._id);
								(partnerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Partners if not signed in', function(done) {
		// Create new Partner model instance
		var partnerObj = new Partner(partner);

		// Save the Partner
		partnerObj.save(function() {
			// Request Partners
			request(app).get('/api/partners')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Partner if not signed in', function(done) {
		// Create new Partner model instance
		var partnerObj = new Partner(partner);

		// Save the Partner
		partnerObj.save(function() {
			request(app).get('/api/partners/' + partnerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', partner.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Partner instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Partner
				agent.post('/api/partners')
					.send(partner)
					.expect(200)
					.end(function(partnerSaveErr, partnerSaveRes) {
						// Handle Partner save error
						if (partnerSaveErr) done(partnerSaveErr);

						// Delete existing Partner
						agent.delete('/api/partners/' + partnerSaveRes.body._id)
							.send(partner)
							.expect(200)
							.end(function(partnerDeleteErr, partnerDeleteRes) {
								// Handle Partner error error
								if (partnerDeleteErr) done(partnerDeleteErr);

								// Set assertions
								(partnerDeleteRes.body._id).should.equal(partnerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Partner instance if not signed in', function(done) {
		// Set Partner user 
		partner.user = user;

		// Create new Partner model instance
		var partnerObj = new Partner(partner);

		// Save the Partner
		partnerObj.save(function() {
			// Try deleting Partner
			request(app).delete('/api/partners/' + partnerObj._id)
			.expect(403)
			.end(function(partnerDeleteErr, partnerDeleteRes) {
				// Set message assertion
				(partnerDeleteRes.body.message).should.match('User is not authorized');

				// Handle Partner error error
				done(partnerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Partner.remove().exec(function(){
				done();
			});
		});
	});
});
