'use strict';

// Configuring the Ads module
angular.module('ads').run(['Menus',
	function(Menus) {
		// Add the Ads dropdown item
		// Menus.addMenuItem('topbar', {
		// 	title: 'Ads',
		// 	state: 'ads',
		// 	type: 'dropdown'
		// });

		 	

		// // Add the dropdown list item
		// Menus.addSubMenuItem('topbar', 'ads', {
		// 	title: 'List Ads',
		// 	state: 'ads.list'
		// });

		// // Add the dropdown create item
		// Menus.addSubMenuItem('topbar', 'ads', {
		// 	title: 'Create Ad',
		// 	state: 'ads.create'
		// });
	}
]);