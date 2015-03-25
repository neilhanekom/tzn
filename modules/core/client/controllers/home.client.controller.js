'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$interval',
	function($scope, Authentication, $interval) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.curArt = [];

		$scope.articles = [
			{'heading' : 'Magoebaskloof Classic', 'body' : 'Tzaneen Cycling presents the Magoebaskloof Classic Race', 'background' : 'modules/core/img/bg/cycle1.jpg'},
			{'heading' : 'This is the 2nd Heading', 'body' : 'This is the second body', 'background' : 'modules/core/img/bg/cycle2.jpg'},
			{'heading' : 'This is the 3rd Heading', 'body' : 'This is the third body', 'background' : 'modules/core/img/bg/cycle3.jpg'}
		];

		$scope.startArticles = function() {
			var total = $scope.curArt.length;
			var index = 0;
			if (total === 0) {
				$scope.curArt.splice(0, total, $scope.articles[index]);
			} 
			
		var start = $interval(function() {
				//binne in die interval moet ons n check of ons nog onder die totaal is en as ons is gaan voort as ons nie is nie reset die index na 0
				var newArt = $scope.articles[index];
				var totalArts = $scope.articles.length;
				if (newArt === undefined) {
					index = 0;
	            	$scope.curArt.splice(0, totalArts, $scope.articles[index]);
	            	index++;
				} else {
	            	$scope.curArt.splice(0, totalArts, $scope.articles[index]);
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