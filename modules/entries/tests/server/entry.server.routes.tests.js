'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Entry = mongoose.model('Entry'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, entry;

/**
 * Entry routes tests
 */
describe('Entry CRUD tests', function() {
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

		// Save a user to the test db and create new Entry
		user.save(function() {
			entry = {
				name: 'Entry Name'
			};

			done();
		});
	});

	it('should be able to save Entry instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Entry
				agent.post('/api/entries')
					.send(entry)
					.expect(200)
					.end(function(entrySaveErr, entrySaveRes) {
						// Handle Entry save error
						if (entrySaveErr) done(entrySaveErr);

						// Get a list of Entries
						agent.get('/api/entries')
							.end(function(entriesGetErr, entriesGetRes) {
								// Handle Entry save error
								if (entriesGetErr) done(entriesGetErr);

								// Get Entries list
								var entries = entriesGetRes.body;

								// Set assertions
								(entries[0].user._id).should.equal(userId);
								(entries[0].name).should.match('Entry Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Entry instance if not logged in', function(done) {
		agent.post('/api/entries')
			.send(entry)
			.expect(403)
			.end(function(entrySaveErr, entrySaveRes) {
				// Call the assertion callback
				done(entrySaveErr);
			});
	});

	it('should not be able to save Entry instance if no name is provided', function(done) {
		// Invalidate name field
		entry.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Entry
				agent.post('/api/entries')
					.send(entry)
					.expect(400)
					.end(function(entrySaveErr, entrySaveRes) {
						// Set message assertion
						(entrySaveRes.body.message).should.match('Please fill Entry name');
						
						// Handle Entry save error
						done(entrySaveErr);
					});
			});
	});

	it('should be able to update Entry instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Entry
				agent.post('/api/entries')
					.send(entry)
					.expect(200)
					.end(function(entrySaveErr, entrySaveRes) {
						// Handle Entry save error
						if (entrySaveErr) done(entrySaveErr);

						// Update Entry name
						entry.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Entry
						agent.put('/api/entries/' + entrySaveRes.body._id)
							.send(entry)
							.expect(200)
							.end(function(entryUpdateErr, entryUpdateRes) {
								// Handle Entry update error
								if (entryUpdateErr) done(entryUpdateErr);

								// Set assertions
								(entryUpdateRes.body._id).should.equal(entrySaveRes.body._id);
								(entryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Entries if not signed in', function(done) {
		// Create new Entry model instance
		var entryObj = new Entry(entry);

		// Save the Entry
		entryObj.save(function() {
			// Request Entries
			request(app).get('/api/entries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Entry if not signed in', function(done) {
		// Create new Entry model instance
		var entryObj = new Entry(entry);

		// Save the Entry
		entryObj.save(function() {
			request(app).get('/api/entries/' + entryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', entry.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Entry instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Entry
				agent.post('/api/entries')
					.send(entry)
					.expect(200)
					.end(function(entrySaveErr, entrySaveRes) {
						// Handle Entry save error
						if (entrySaveErr) done(entrySaveErr);

						// Delete existing Entry
						agent.delete('/api/entries/' + entrySaveRes.body._id)
							.send(entry)
							.expect(200)
							.end(function(entryDeleteErr, entryDeleteRes) {
								// Handle Entry error error
								if (entryDeleteErr) done(entryDeleteErr);

								// Set assertions
								(entryDeleteRes.body._id).should.equal(entrySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Entry instance if not signed in', function(done) {
		// Set Entry user 
		entry.user = user;

		// Create new Entry model instance
		var entryObj = new Entry(entry);

		// Save the Entry
		entryObj.save(function() {
			// Try deleting Entry
			request(app).delete('/api/entries/' + entryObj._id)
			.expect(403)
			.end(function(entryDeleteErr, entryDeleteRes) {
				// Set message assertion
				(entryDeleteRes.body.message).should.match('User is not authorized');

				// Handle Entry error error
				done(entryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Entry.remove().exec(function(){
				done();
			});
		});
	});
});
