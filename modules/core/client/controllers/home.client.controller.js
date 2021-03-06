'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$interval', '$timeout', '$mdSidenav', 'Advertisements', 'Partners', 'deviceDetector',
	function($scope, Authentication, $interval, $timeout, $mdSidenav, Advertisements, Partners, deviceDetector ) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$scope.white = '#FFFFFF';
		$scope.lgrey = '#EEEEEE';
		

		$scope.pushPartners = function() {
			$scope.partners = Partners.query();
			$timeout(function() {
	      		angular.forEach($scope.partners, function(partner) {
				$scope.partnerImages.push(partner.imageUrl);
				});
				console.log($scope.partnerImages);
	   		}, 1000);
			
		};


		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };


        $scope.collapseProfile = true;
		$scope.toggleProfile = function() {
			$scope.collapseProfile = !$scope.collapseProfile;

		};

		
		$scope.curAd = [
			
		];
		$scope.curArt = [];

		$scope.advertisements = Advertisements.query();
		$scope.articles = [
			
		];

		$scope.startArticles = function() {
			var total = $scope.curAd.length;
			var index = 0;
			if (total === 0) {
				$scope.curAd.splice(0, total, $scope.advertisements[index]);
				
			} 
			
		var start = $interval(function() {
				//binne in die interval moet ons n check of ons nog onder die totaal is en as ons is gaan voort as ons nie is nie reset die index na 0
				var newAd = $scope.advertisements[index];
				var totalAds = $scope.advertisements.length;
				if (newAd === undefined) {
					index = 0;
	            	$scope.curAd.splice(0, totalAds, $scope.advertisements[index]);
	            	index++;
				} else {
	            	$scope.curAd.splice(0, totalAds, $scope.advertisements[index]);
	            	index++;
				}	
       		}, 5000);

		$scope.stop = function() {
				$interval.cancel(start);
		};

		$scope.$on('$destroy', function() {
				$scope.stop();
		});
       			
		};

		

		

		 // stop = $interval(function($scope) {
            
   //        }, 100);

		 // $scope.$on('$destroy', function() {
   //        // Make sure that the interval is destroyed too
   //        $scope.stopFight();
   //      });

	}
]);