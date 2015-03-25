'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Left = mongoose.model('Left'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, left;

/**
 * Left routes tests
 */
describe('Left CRUD tests', function() {
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

		// Save a user to the test db and create new Left
		user.save(function() {
			left = {
				name: 'Left Name'
			};

			done();
		});
	});

	it('should be able to save Left instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Left
				agent.post('/api/lefts')
					.send(left)
					.expect(200)
					.end(function(leftSaveErr, leftSaveRes) {
						// Handle Left save error
						if (leftSaveErr) done(leftSaveErr);

						// Get a list of Lefts
						agent.get('/api/lefts')
							.end(function(leftsGetErr, leftsGetRes) {
								// Handle Left save error
								if (leftsGetErr) done(leftsGetErr);

								// Get Lefts list
								var lefts = leftsGetRes.body;

								// Set assertions
								(lefts[0].user._id).should.equal(userId);
								(lefts[0].name).should.match('Left Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Left instance if not logged in', function(done) {
		agent.post('/api/lefts')
			.send(left)
			.expect(403)
			.end(function(leftSaveErr, leftSaveRes) {
				// Call the assertion callback
				done(leftSaveErr);
			});
	});

	it('should not be able to save Left instance if no name is provided', function(done) {
		// Invalidate name field
		left.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Left
				agent.post('/api/lefts')
					.send(left)
					.expect(400)
					.end(function(leftSaveErr, leftSaveRes) {
						// Set message assertion
						(leftSaveRes.body.message).should.match('Please fill Left name');
						
						// Handle Left save error
						done(leftSaveErr);
					});
			});
	});

	it('should be able to update Left instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Left
				agent.post('/api/lefts')
					.send(left)
					.expect(200)
					.end(function(leftSaveErr, leftSaveRes) {
						// Handle Left save error
						if (leftSaveErr) done(leftSaveErr);

						// Update Left name
						left.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Left
						agent.put('/api/lefts/' + leftSaveRes.body._id)
							.send(left)
							.expect(200)
							.end(function(leftUpdateErr, leftUpdateRes) {
								// Handle Left update error
								if (leftUpdateErr) done(leftUpdateErr);

								// Set assertions
								(leftUpdateRes.body._id).should.equal(leftSaveRes.body._id);
								(leftUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Lefts if not signed in', function(done) {
		// Create new Left model instance
		var leftObj = new Left(left);

		// Save the Left
		leftObj.save(function() {
			// Request Lefts
			request(app).get('/api/lefts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Left if not signed in', function(done) {
		// Create new Left model instance
		var leftObj = new Left(left);

		// Save the Left
		leftObj.save(function() {
			request(app).get('/api/lefts/' + leftObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', left.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Left instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Left
				agent.post('/api/lefts')
					.send(left)
					.expect(200)
					.end(function(leftSaveErr, leftSaveRes) {
						// Handle Left save error
						if (leftSaveErr) done(leftSaveErr);

						// Delete existing Left
						agent.delete('/api/lefts/' + leftSaveRes.body._id)
							.send(left)
							.expect(200)
							.end(function(leftDeleteErr, leftDeleteRes) {
								// Handle Left error error
								if (leftDeleteErr) done(leftDeleteErr);

								// Set assertions
								(leftDeleteRes.body._id).should.equal(leftSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Left instance if not signed in', function(done) {
		// Set Left user 
		left.user = user;

		// Create new Left model instance
		var leftObj = new Left(left);

		// Save the Left
		leftObj.save(function() {
			// Try deleting Left
			request(app).delete('/api/lefts/' + leftObj._id)
			.expect(403)
			.end(function(leftDeleteErr, leftDeleteRes) {
				// Set message assertion
				(leftDeleteRes.body.message).should.match('User is not authorized');

				// Handle Left error error
				done(leftDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Left.remove().exec(function(){
				done();
			});
		});
	});
});
