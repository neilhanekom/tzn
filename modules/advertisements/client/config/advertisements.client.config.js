'use strict';

// Configuring the Advertisements module
angular.module('advertisements').run(['Menus',
	function(Menus) {
		// Add the Advertisements dropdown item
		// Menus.addMenuItem('topbar', {
		// 	title: 'Advertisements',
		// 	state: 'advertisements',
		// 	type: 'dropdown'
		// });

		// // Add the dropdown list item
		// Menus.addSubMenuItem('topbar', 'advertisements', {
		// 	title: 'List Advertisements',
		// 	state: 'advertisements.list'
		// });

		// // Add the dropdown create item
		// Menus.addSubMenuItem('topbar', 'advertisements', {
		// 	title: 'Create Advertisement',
		// 	state: 'advertisements.create'
		// });
	}
]);