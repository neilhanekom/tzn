'use strict';

// Ads controller
angular.module('ads').controller('AdsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ads',
	function($scope, $stateParams, $location, Authentication, Ads ) {
		$scope.authentication = Authentication;

		// Create new Ad
		$scope.create = function() {
			// Create new Ad object
			var ad = new Ads ({
				name: this.name
			});

			// Redirect after save
			ad.$save(function(response) {
				$location.path('ads/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ad
		$scope.remove = function( ad ) {
			if ( ad ) { ad.$remove();

				for (var i in $scope.ads ) {
					if ($scope.ads [i] === ad ) {
						$scope.ads.splice(i, 1);
					}
				}
			} else {
				$scope.ad.$remove(function() {
					$location.path('ads');
				});
			}
		};

		// Update existing Ad
		$scope.update = function() {
			var ad = $scope.ad ;

			ad.$update(function() {
				$location.path('ads/' + ad._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ads
		$scope.find = function() {
			$scope.ads = Ads.query();
		};

		// Find existing Ad
		$scope.findOne = function() {
			$scope.ad = Ads.get({ 
				adId: $stateParams.adId
			});
		};
	}
]);