'use strict';

(function() {
	// Grabbas Controller Spec
	describe('Grabbas Controller Tests', function() {
		// Initialize global variables
		var GrabbasController,
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

			// Initialize the Grabbas controller.
			GrabbasController = $controller('GrabbasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Grabba object fetched from XHR', inject(function(Grabbas) {
			// Create sample Grabba using the Grabbas service
			var sampleGrabba = new Grabbas({
				name: 'New Grabba'
			});

			// Create a sample Grabbas array that includes the new Grabba
			var sampleGrabbas = [sampleGrabba];

			// Set GET response
			$httpBackend.expectGET('api/grabbas').respond(sampleGrabbas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grabbas).toEqualData(sampleGrabbas);
		}));

		it('$scope.findOne() should create an array with one Grabba object fetched from XHR using a grabbaId URL parameter', inject(function(Grabbas) {
			// Define a sample Grabba object
			var sampleGrabba = new Grabbas({
				name: 'New Grabba'
			});

			// Set the URL parameter
			$stateParams.grabbaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/grabbas\/([0-9a-fA-F]{24})$/).respond(sampleGrabba);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.grabba).toEqualData(sampleGrabba);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Grabbas) {
			// Create a sample Grabba object
			var sampleGrabbaPostData = new Grabbas({
				name: 'New Grabba'
			});

			// Create a sample Grabba response
			var sampleGrabbaResponse = new Grabbas({
				_id: '525cf20451979dea2c000001',
				name: 'New Grabba'
			});

			// Fixture mock form input values
			scope.name = 'New Grabba';

			// Set POST response
			$httpBackend.expectPOST('api/grabbas', sampleGrabbaPostData).respond(sampleGrabbaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Grabba was created
			expect($location.path()).toBe('/grabbas/' + sampleGrabbaResponse._id);
		}));

		it('$scope.update() should update a valid Grabba', inject(function(Grabbas) {
			// Define a sample Grabba put data
			var sampleGrabbaPutData = new Grabbas({
				_id: '525cf20451979dea2c000001',
				name: 'New Grabba'
			});

			// Mock Grabba in scope
			scope.grabba = sampleGrabbaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/grabbas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/grabbas/' + sampleGrabbaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid grabbaId and remove the Grabba from the scope', inject(function(Grabbas) {
			// Create new Grabba object
			var sampleGrabba = new Grabbas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Grabbas array and include the Grabba
			scope.grabbas = [sampleGrabba];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/grabbas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGrabba);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.grabbas.length).toBe(0);
		}));
	});
}());