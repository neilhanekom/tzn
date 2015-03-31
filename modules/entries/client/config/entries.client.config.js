'use strict';

// Configuring the Entries module
angular.module('entries').run(['Menus',
	function(Menus) {
		// Add the Entries dropdown item
		// Menus.addMenuItem('topbar', {
		// 	title: 'Entries',
		// 	state: 'entries',
		// 	type: 'dropdown'
		// });

		// // Add the dropdown list item
		// Menus.addSubMenuItem('topbar', 'entries', {
		// 	title: 'List Entries',
		// 	state: 'entries.list'
		// });

		// // Add the dropdown create item
		// Menus.addSubMenuItem('topbar', 'entries', {
		// 	title: 'Create Entry',
		// 	state: 'entries.create'
		// });
	}
]);