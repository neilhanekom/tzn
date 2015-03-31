'use strict';

// Configuring the Grabbas module
angular.module('grabbas').run(['Menus',
	function(Menus) {
		// Add the Grabbas dropdown item
		// Menus.addMenuItem('y', {
		// 	title: 'Grabbas',
		// 	state: 'grabbas',
		// 	type: 'dropdown'
		// });

		// // Add the dropdown list item
		// Menus.addSubMenuItem('y', 'grabbas', {
		// 	title: 'List Grabbas',
		// 	state: 'grabbas.list'
		// });

		// // Add the dropdown create item
		// Menus.addSubMenuItem('y', 'grabbas', {
		// 	title: 'Create Grabba',
		// 	state: 'grabbas.create'
		// });
	}
]);