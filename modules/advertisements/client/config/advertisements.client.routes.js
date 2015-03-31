'use strict';

//Setting up route
angular.module('advertisements').config(['$stateProvider',
	function($stateProvider) {
		// Advertisements state routing
		$stateProvider.
		state('advertisements', {
			abstract: true,
			url: '/advertisements',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('advertisements.list', {
			url: '',
			templateUrl: 'modules/advertisements/views/list-advertisements.client.view.html'
		}).
		state('advertisements.create', {
			url: '/create',
			templateUrl: 'modules/advertisements/views/create-advertisement.client.view.html'
		}).
		state('advertisements.view', {
			url: '/:advertisementId',
			templateUrl: 'modules/advertisements/views/view-advertisement.client.view.html'
		}).
		state('advertisements.edit', {
			url: '/:advertisementId/edit',
			templateUrl: 'modules/advertisements/views/edit-advertisement.client.view.html'
		});
	}
]);