'use strict';

// Rides controller
angular.module('rides').controller('RidesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rides',
	function($scope, $stateParams, $location, Authentication, Rides ) {
		$scope.authentication = Authentication;

		// Create new Ride
		$scope.create = function() {
			// Create new Ride object
			var ride = new Rides ({
				name: this.name
			});

			// Redirect after save
			ride.$save(function(response) {
				$location.path('rides/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ride
		$scope.remove = function( ride ) {
			if ( ride ) { ride.$remove();

				for (var i in $scope.rides ) {
					if ($scope.rides [i] === ride ) {
						$scope.rides.splice(i, 1);
					}
				}
			} else {
				$scope.ride.$remove(function() {
					$location.path('rides');
				});
			}
		};

		// Update existing Ride
		$scope.update = function() {
			var ride = $scope.ride ;

			ride.$update(function() {
				$location.path('rides/' + ride._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rides
		$scope.find = function() {
			$scope.rides = Rides.query();
		};

		// Find existing Ride
		$scope.findOne = function() {
			$scope.ride = Rides.get({ 
				rideId: $stateParams.rideId
			});
		};
	}
]);