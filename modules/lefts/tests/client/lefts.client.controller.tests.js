'use strict';

(function() {
	// Lefts Controller Spec
	describe('Lefts Controller Tests', function() {
		// Initialize global variables
		var LeftsController,
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

			// Initialize the Lefts controller.
			LeftsController = $controller('LeftsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Left object fetched from XHR', inject(function(Lefts) {
			// Create sample Left using the Lefts service
			var sampleLeft = new Lefts({
				name: 'New Left'
			});

			// Create a sample Lefts array that includes the new Left
			var sampleLefts = [sampleLeft];

			// Set GET response
			$httpBackend.expectGET('api/lefts').respond(sampleLefts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lefts).toEqualData(sampleLefts);
		}));

		it('$scope.findOne() should create an array with one Left object fetched from XHR using a leftId URL parameter', inject(function(Lefts) {
			// Define a sample Left object
			var sampleLeft = new Lefts({
				name: 'New Left'
			});

			// Set the URL parameter
			$stateParams.leftId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/lefts\/([0-9a-fA-F]{24})$/).respond(sampleLeft);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.left).toEqualData(sampleLeft);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Lefts) {
			// Create a sample Left object
			var sampleLeftPostData = new Lefts({
				name: 'New Left'
			});

			// Create a sample Left response
			var sampleLeftResponse = new Lefts({
				_id: '525cf20451979dea2c000001',
				name: 'New Left'
			});

			// Fixture mock form input values
			scope.name = 'New Left';

			// Set POST response
			$httpBackend.expectPOST('api/lefts', sampleLeftPostData).respond(sampleLeftResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Left was created
			expect($location.path()).toBe('/lefts/' + sampleLeftResponse._id);
		}));

		it('$scope.update() should update a valid Left', inject(function(Lefts) {
			// Define a sample Left put data
			var sampleLeftPutData = new Lefts({
				_id: '525cf20451979dea2c000001',
				name: 'New Left'
			});

			// Mock Left in scope
			scope.left = sampleLeftPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/lefts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/lefts/' + sampleLeftPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid leftId and remove the Left from the scope', inject(function(Lefts) {
			// Create new Left object
			var sampleLeft = new Lefts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Lefts array and include the Left
			scope.lefts = [sampleLeft];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/lefts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLeft);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.lefts.length).toBe(0);
		}));
	});
}());