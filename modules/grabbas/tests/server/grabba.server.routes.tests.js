'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Grabba = mongoose.model('Grabba'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, grabba;

/**
 * Grabba routes tests
 */
describe('Grabba CRUD tests', function() {
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

		// Save a user to the test db and create new Grabba
		user.save(function() {
			grabba = {
				name: 'Grabba Name'
			};

			done();
		});
	});

	it('should be able to save Grabba instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grabba
				agent.post('/api/grabbas')
					.send(grabba)
					.expect(200)
					.end(function(grabbaSaveErr, grabbaSaveRes) {
						// Handle Grabba save error
						if (grabbaSaveErr) done(grabbaSaveErr);

						// Get a list of Grabbas
						agent.get('/api/grabbas')
							.end(function(grabbasGetErr, grabbasGetRes) {
								// Handle Grabba save error
								if (grabbasGetErr) done(grabbasGetErr);

								// Get Grabbas list
								var grabbas = grabbasGetRes.body;

								// Set assertions
								(grabbas[0].user._id).should.equal(userId);
								(grabbas[0].name).should.match('Grabba Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Grabba instance if not logged in', function(done) {
		agent.post('/api/grabbas')
			.send(grabba)
			.expect(403)
			.end(function(grabbaSaveErr, grabbaSaveRes) {
				// Call the assertion callback
				done(grabbaSaveErr);
			});
	});

	it('should not be able to save Grabba instance if no name is provided', function(done) {
		// Invalidate name field
		grabba.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grabba
				agent.post('/api/grabbas')
					.send(grabba)
					.expect(400)
					.end(function(grabbaSaveErr, grabbaSaveRes) {
						// Set message assertion
						(grabbaSaveRes.body.message).should.match('Please fill Grabba name');
						
						// Handle Grabba save error
						done(grabbaSaveErr);
					});
			});
	});

	it('should be able to update Grabba instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grabba
				agent.post('/api/grabbas')
					.send(grabba)
					.expect(200)
					.end(function(grabbaSaveErr, grabbaSaveRes) {
						// Handle Grabba save error
						if (grabbaSaveErr) done(grabbaSaveErr);

						// Update Grabba name
						grabba.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Grabba
						agent.put('/api/grabbas/' + grabbaSaveRes.body._id)
							.send(grabba)
							.expect(200)
							.end(function(grabbaUpdateErr, grabbaUpdateRes) {
								// Handle Grabba update error
								if (grabbaUpdateErr) done(grabbaUpdateErr);

								// Set assertions
								(grabbaUpdateRes.body._id).should.equal(grabbaSaveRes.body._id);
								(grabbaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Grabbas if not signed in', function(done) {
		// Create new Grabba model instance
		var grabbaObj = new Grabba(grabba);

		// Save the Grabba
		grabbaObj.save(function() {
			// Request Grabbas
			request(app).get('/api/grabbas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Grabba if not signed in', function(done) {
		// Create new Grabba model instance
		var grabbaObj = new Grabba(grabba);

		// Save the Grabba
		grabbaObj.save(function() {
			request(app).get('/api/grabbas/' + grabbaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', grabba.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Grabba instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Grabba
				agent.post('/api/grabbas')
					.send(grabba)
					.expect(200)
					.end(function(grabbaSaveErr, grabbaSaveRes) {
						// Handle Grabba save error
						if (grabbaSaveErr) done(grabbaSaveErr);

						// Delete existing Grabba
						agent.delete('/api/grabbas/' + grabbaSaveRes.body._id)
							.send(grabba)
							.expect(200)
							.end(function(grabbaDeleteErr, grabbaDeleteRes) {
								// Handle Grabba error error
								if (grabbaDeleteErr) done(grabbaDeleteErr);

								// Set assertions
								(grabbaDeleteRes.body._id).should.equal(grabbaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Grabba instance if not signed in', function(done) {
		// Set Grabba user 
		grabba.user = user;

		// Create new Grabba model instance
		var grabbaObj = new Grabba(grabba);

		// Save the Grabba
		grabbaObj.save(function() {
			// Try deleting Grabba
			request(app).delete('/api/grabbas/' + grabbaObj._id)
			.expect(403)
			.end(function(grabbaDeleteErr, grabbaDeleteRes) {
				// Set message assertion
				(grabbaDeleteRes.body.message).should.match('User is not authorized');

				// Handle Grabba error error
				done(grabbaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Grabba.remove().exec(function(){
				done();
			});
		});
	});
});
