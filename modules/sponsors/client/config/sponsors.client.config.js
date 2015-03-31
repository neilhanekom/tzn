'use strict';

// Configuring the Sponsors module
angular.module('sponsors').run(['Menus',
	function(Menus) {
		// Add the Sponsors dropdown item
		// Menus.addMenuItem('topbar', {
		// 	title: 'Sponsors',
		// 	state: 'sponsors',
		// 	type: 'dropdown'
		// });

		// // Add the dropdown list item
		// Menus.addSubMenuItem('topbar', 'sponsors', {
		// 	title: 'List Sponsors',
		// 	state: 'sponsors.list'
		// });

		// // Add the dropdown create item
		// Menus.addSubMenuItem('topbar', 'sponsors', {
		// 	title: 'Create Sponsor',
		// 	state: 'sponsors.create'
		// });
	}
]);