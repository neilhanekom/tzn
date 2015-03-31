'use strict';

// Configuring the Partners module
angular.module('partners').run(['Menus',
	function(Menus) {
		// Add the Partners dropdown item
		// Menus.addMenuItem('topbar', {
		// 	title: 'Partners',
		// 	state: 'partners',
		// 	type: 'dropdown'
		// });

		// // Add the dropdown list item
		// Menus.addSubMenuItem('topbar', 'partners', {
		// 	title: 'List Partners',
		// 	state: 'partners.list'
		// });

		// // Add the dropdown create item
		// Menus.addSubMenuItem('topbar', 'partners', {
		// 	title: 'Create Partner',
		// 	state: 'partners.create'
		// });
	}
]);