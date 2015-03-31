'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Advertisement = mongoose.model('Advertisement');

/**
 * Globals
 */
var user, advertisement;

/**
 * Unit tests
 */
describe('Advertisement Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			advertisement = new Advertisement({
				name: 'Advertisement Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return advertisement.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			advertisement.name = '';

			return advertisement.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Advertisement.remove().exec(function(){
			User.remove().exec(function(){
				done();
			});	
		});
	});
});
