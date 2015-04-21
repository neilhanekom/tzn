'use strict';

angular.module('core').controller('LeftController', ['$scope', 'Menus', 'Authentication', '$mdSidenav',
	function($scope, Menus, Authentication, $mdSidenav) {

		$scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        
		$scope.authentication = Authentication;

		$scope.sidenav = Menus.getMenu('sidenav');

		
	}
]);