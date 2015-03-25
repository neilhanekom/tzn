'use strict';

// Sponsors controller
angular.module('sponsors').controller('SponsorsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sponsors',
	function($scope, $stateParams, $location, Authentication, Sponsors ) {
		$scope.authentication = Authentication;

		// Create new Sponsor
		$scope.create = function() {
			// Create new Sponsor object
			var sponsor = new Sponsors ({
				name: this.name
			});

			// Redirect after save
			sponsor.$save(function(response) {
				$location.path('sponsors/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sponsor
		$scope.remove = function( sponsor ) {
			if ( sponsor ) { sponsor.$remove();

				for (var i in $scope.sponsors ) {
					if ($scope.sponsors [i] === sponsor ) {
						$scope.sponsors.splice(i, 1);
					}
				}
			} else {
				$scope.sponsor.$remove(function() {
					$location.path('sponsors');
				});
			}
		};

		// Update existing Sponsor
		$scope.update = function() {
			var sponsor = $scope.sponsor ;

			sponsor.$update(function() {
				$location.path('sponsors/' + sponsor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sponsors
		$scope.find = function() {
			$scope.sponsors = Sponsors.query();
		};

		// Find existing Sponsor
		$scope.findOne = function() {
			$scope.sponsor = Sponsors.get({ 
				sponsorId: $stateParams.sponsorId
			});
		};
	}
]);