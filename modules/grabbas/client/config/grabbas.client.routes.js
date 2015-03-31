'use strict';

//Setting up route
angular.module('grabbas').config(['$stateProvider',
	function($stateProvider) {
		// Grabbas state routing
		$stateProvider.
		state('grabbas', {
			abstract: true,
			url: '/grabbas',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('grabbas.list', {
			url: '',
			templateUrl: 'modules/grabbas/views/list-grabbas.client.view.html'
		}).
		state('grabbas.create', {
			url: '/create',
			templateUrl: 'modules/grabbas/views/create-grabba.client.view.html'
		}).
		state('grabbas.view', {
			url: '/:grabbaId',
			templateUrl: 'modules/grabbas/views/view-grabba.client.view.html'
		}).
		state('grabbas.edit', {
			url: '/:grabbaId/edit',
			templateUrl: 'modules/grabbas/views/edit-grabba.client.view.html'
		});
	}
]);