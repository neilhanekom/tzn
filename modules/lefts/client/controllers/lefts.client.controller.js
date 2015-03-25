'use strict';

// Lefts controller
angular.module('lefts').controller('LeftsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lefts', 'Menus',
	function($scope, $stateParams, $location, Authentication, Lefts, Menus ) {
		
		$scope.authentication = Authentication;

		$scope.sidenav = Menus.getMenu('sidenav');

		
	}
]);