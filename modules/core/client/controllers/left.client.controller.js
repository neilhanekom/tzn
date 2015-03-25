'use strict';

angular.module('core').controller('LeftController', ['$scope', 'Menus', 'Authentication',
	function($scope, Menus, Authentication) {

		$scope.authentication = Authentication;

		$scope.sidenav = Menus.getMenu('sidenav');

		
	}
]);