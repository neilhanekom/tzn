'use strict';

(function() {
	// Advertisements Controller Spec
	describe('Advertisements Controller Tests', function() {
		// Initialize global variables
		var AdvertisementsController,
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

			// Initialize the Advertisements controller.
			AdvertisementsController = $controller('AdvertisementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Advertisement object fetched from XHR', inject(function(Advertisements) {
			// Create sample Advertisement using the Advertisements service
			var sampleAdvertisement = new Advertisements({
				name: 'New Advertisement'
			});

			// Create a sample Advertisements array that includes the new Advertisement
			var sampleAdvertisements = [sampleAdvertisement];

			// Set GET response
			$httpBackend.expectGET('api/advertisements').respond(sampleAdvertisements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.advertisements).toEqualData(sampleAdvertisements);
		}));

		it('$scope.findOne() should create an array with one Advertisement object fetched from XHR using a advertisementId URL parameter', inject(function(Advertisements) {
			// Define a sample Advertisement object
			var sampleAdvertisement = new Advertisements({
				name: 'New Advertisement'
			});

			// Set the URL parameter
			$stateParams.advertisementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/advertisements\/([0-9a-fA-F]{24})$/).respond(sampleAdvertisement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.advertisement).toEqualData(sampleAdvertisement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Advertisements) {
			// Create a sample Advertisement object
			var sampleAdvertisementPostData = new Advertisements({
				name: 'New Advertisement'
			});

			// Create a sample Advertisement response
			var sampleAdvertisementResponse = new Advertisements({
				_id: '525cf20451979dea2c000001',
				name: 'New Advertisement'
			});

			// Fixture mock form input values
			scope.name = 'New Advertisement';

			// Set POST response
			$httpBackend.expectPOST('api/advertisements', sampleAdvertisementPostData).respond(sampleAdvertisementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Advertisement was created
			expect($location.path()).toBe('/advertisements/' + sampleAdvertisementResponse._id);
		}));

		it('$scope.update() should update a valid Advertisement', inject(function(Advertisements) {
			// Define a sample Advertisement put data
			var sampleAdvertisementPutData = new Advertisements({
				_id: '525cf20451979dea2c000001',
				name: 'New Advertisement'
			});

			// Mock Advertisement in scope
			scope.advertisement = sampleAdvertisementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/advertisements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/advertisements/' + sampleAdvertisementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid advertisementId and remove the Advertisement from the scope', inject(function(Advertisements) {
			// Create new Advertisement object
			var sampleAdvertisement = new Advertisements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Advertisements array and include the Advertisement
			scope.advertisements = [sampleAdvertisement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/advertisements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAdvertisement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.advertisements.length).toBe(0);
		}));
	});
}());