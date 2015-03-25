'use strict';

(function() {
	// Sponsors Controller Spec
	describe('Sponsors Controller Tests', function() {
		// Initialize global variables
		var SponsorsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Sponsors controller.
			SponsorsController = $controller('SponsorsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sponsor object fetched from XHR', inject(function(Sponsors) {
			// Create sample Sponsor using the Sponsors service
			var sampleSponsor = new Sponsors({
				name: 'New Sponsor'
			});

			// Create a sample Sponsors array that includes the new Sponsor
			var sampleSponsors = [sampleSponsor];

			// Set GET response
			$httpBackend.expectGET('api/sponsors').respond(sampleSponsors);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sponsors).toEqualData(sampleSponsors);
		}));

		it('$scope.findOne() should create an array with one Sponsor object fetched from XHR using a sponsorId URL parameter', inject(function(Sponsors) {
			// Define a sample Sponsor object
			var sampleSponsor = new Sponsors({
				name: 'New Sponsor'
			});

			// Set the URL parameter
			$stateParams.sponsorId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/sponsors\/([0-9a-fA-F]{24})$/).respond(sampleSponsor);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sponsor).toEqualData(sampleSponsor);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sponsors) {
			// Create a sample Sponsor object
			var sampleSponsorPostData = new Sponsors({
				name: 'New Sponsor'
			});

			// Create a sample Sponsor response
			var sampleSponsorResponse = new Sponsors({
				_id: '525cf20451979dea2c000001',
				name: 'New Sponsor'
			});

			// Fixture mock form input values
			scope.name = 'New Sponsor';

			// Set POST response
			$httpBackend.expectPOST('api/sponsors', sampleSponsorPostData).respond(sampleSponsorResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sponsor was created
			expect($location.path()).toBe('/sponsors/' + sampleSponsorResponse._id);
		}));

		it('$scope.update() should update a valid Sponsor', inject(function(Sponsors) {
			// Define a sample Sponsor put data
			var sampleSponsorPutData = new Sponsors({
				_id: '525cf20451979dea2c000001',
				name: 'New Sponsor'
			});

			// Mock Sponsor in scope
			scope.sponsor = sampleSponsorPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/sponsors\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sponsors/' + sampleSponsorPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sponsorId and remove the Sponsor from the scope', inject(function(Sponsors) {
			// Create new Sponsor object
			var sampleSponsor = new Sponsors({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sponsors array and include the Sponsor
			scope.sponsors = [sampleSponsor];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/sponsors\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSponsor);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sponsors.length).toBe(0);
		}));
	});
}());