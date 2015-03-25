'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sponsor = mongoose.model('Sponsor'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, sponsor;

/**
 * Sponsor routes tests
 */
describe('Sponsor CRUD tests', function() {
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

		// Save a user to the test db and create new Sponsor
		user.save(function() {
			sponsor = {
				name: 'Sponsor Name'
			};

			done();
		});
	});

	it('should be able to save Sponsor instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sponsor
				agent.post('/api/sponsors')
					.send(sponsor)
					.expect(200)
					.end(function(sponsorSaveErr, sponsorSaveRes) {
						// Handle Sponsor save error
						if (sponsorSaveErr) done(sponsorSaveErr);

						// Get a list of Sponsors
						agent.get('/api/sponsors')
							.end(function(sponsorsGetErr, sponsorsGetRes) {
								// Handle Sponsor save error
								if (sponsorsGetErr) done(sponsorsGetErr);

								// Get Sponsors list
								var sponsors = sponsorsGetRes.body;

								// Set assertions
								(sponsors[0].user._id).should.equal(userId);
								(sponsors[0].name).should.match('Sponsor Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sponsor instance if not logged in', function(done) {
		agent.post('/api/sponsors')
			.send(sponsor)
			.expect(403)
			.end(function(sponsorSaveErr, sponsorSaveRes) {
				// Call the assertion callback
				done(sponsorSaveErr);
			});
	});

	it('should not be able to save Sponsor instance if no name is provided', function(done) {
		// Invalidate name field
		sponsor.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sponsor
				agent.post('/api/sponsors')
					.send(sponsor)
					.expect(400)
					.end(function(sponsorSaveErr, sponsorSaveRes) {
						// Set message assertion
						(sponsorSaveRes.body.message).should.match('Please fill Sponsor name');
						
						// Handle Sponsor save error
						done(sponsorSaveErr);
					});
			});
	});

	it('should be able to update Sponsor instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sponsor
				agent.post('/api/sponsors')
					.send(sponsor)
					.expect(200)
					.end(function(sponsorSaveErr, sponsorSaveRes) {
						// Handle Sponsor save error
						if (sponsorSaveErr) done(sponsorSaveErr);

						// Update Sponsor name
						sponsor.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sponsor
						agent.put('/api/sponsors/' + sponsorSaveRes.body._id)
							.send(sponsor)
							.expect(200)
							.end(function(sponsorUpdateErr, sponsorUpdateRes) {
								// Handle Sponsor update error
								if (sponsorUpdateErr) done(sponsorUpdateErr);

								// Set assertions
								(sponsorUpdateRes.body._id).should.equal(sponsorSaveRes.body._id);
								(sponsorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sponsors if not signed in', function(done) {
		// Create new Sponsor model instance
		var sponsorObj = new Sponsor(sponsor);

		// Save the Sponsor
		sponsorObj.save(function() {
			// Request Sponsors
			request(app).get('/api/sponsors')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sponsor if not signed in', function(done) {
		// Create new Sponsor model instance
		var sponsorObj = new Sponsor(sponsor);

		// Save the Sponsor
		sponsorObj.save(function() {
			request(app).get('/api/sponsors/' + sponsorObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sponsor.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sponsor instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sponsor
				agent.post('/api/sponsors')
					.send(sponsor)
					.expect(200)
					.end(function(sponsorSaveErr, sponsorSaveRes) {
						// Handle Sponsor save error
						if (sponsorSaveErr) done(sponsorSaveErr);

						// Delete existing Sponsor
						agent.delete('/api/sponsors/' + sponsorSaveRes.body._id)
							.send(sponsor)
							.expect(200)
							.end(function(sponsorDeleteErr, sponsorDeleteRes) {
								// Handle Sponsor error error
								if (sponsorDeleteErr) done(sponsorDeleteErr);

								// Set assertions
								(sponsorDeleteRes.body._id).should.equal(sponsorSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sponsor instance if not signed in', function(done) {
		// Set Sponsor user 
		sponsor.user = user;

		// Create new Sponsor model instance
		var sponsorObj = new Sponsor(sponsor);

		// Save the Sponsor
		sponsorObj.save(function() {
			// Try deleting Sponsor
			request(app).delete('/api/sponsors/' + sponsorObj._id)
			.expect(403)
			.end(function(sponsorDeleteErr, sponsorDeleteRes) {
				// Set message assertion
				(sponsorDeleteRes.body.message).should.match('User is not authorized');

				// Handle Sponsor error error
				done(sponsorDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Sponsor.remove().exec(function(){
				done();
			});
		});
	});
});
