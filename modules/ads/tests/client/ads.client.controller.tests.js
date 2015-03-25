'use strict';

(function() {
	// Ads Controller Spec
	describe('Ads Controller Tests', function() {
		// Initialize global variables
		var AdsController,
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

			// Initialize the Ads controller.
			AdsController = $controller('AdsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ad object fetched from XHR', inject(function(Ads) {
			// Create sample Ad using the Ads service
			var sampleAd = new Ads({
				name: 'New Ad'
			});

			// Create a sample Ads array that includes the new Ad
			var sampleAds = [sampleAd];

			// Set GET response
			$httpBackend.expectGET('api/ads').respond(sampleAds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ads).toEqualData(sampleAds);
		}));

		it('$scope.findOne() should create an array with one Ad object fetched from XHR using a adId URL parameter', inject(function(Ads) {
			// Define a sample Ad object
			var sampleAd = new Ads({
				name: 'New Ad'
			});

			// Set the URL parameter
			$stateParams.adId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/ads\/([0-9a-fA-F]{24})$/).respond(sampleAd);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ad).toEqualData(sampleAd);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ads) {
			// Create a sample Ad object
			var sampleAdPostData = new Ads({
				name: 'New Ad'
			});

			// Create a sample Ad response
			var sampleAdResponse = new Ads({
				_id: '525cf20451979dea2c000001',
				name: 'New Ad'
			});

			// Fixture mock form input values
			scope.name = 'New Ad';

			// Set POST response
			$httpBackend.expectPOST('api/ads', sampleAdPostData).respond(sampleAdResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ad was created
			expect($location.path()).toBe('/ads/' + sampleAdResponse._id);
		}));

		it('$scope.update() should update a valid Ad', inject(function(Ads) {
			// Define a sample Ad put data
			var sampleAdPutData = new Ads({
				_id: '525cf20451979dea2c000001',
				name: 'New Ad'
			});

			// Mock Ad in scope
			scope.ad = sampleAdPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/ads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ads/' + sampleAdPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid adId and remove the Ad from the scope', inject(function(Ads) {
			// Create new Ad object
			var sampleAd = new Ads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ads array and include the Ad
			scope.ads = [sampleAd];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/ads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAd);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ads.length).toBe(0);
		}));
	});
}());