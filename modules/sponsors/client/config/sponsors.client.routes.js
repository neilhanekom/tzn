'use strict';

//Setting up route
angular.module('sponsors').config(['$stateProvider',
	function($stateProvider) {
		// Sponsors state routing
		$stateProvider.
		state('sponsors', {
			abstract: true,
			url: '/sponsors',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('sponsors.list', {
			url: '',
			templateUrl: 'modules/sponsors/views/list-sponsors.client.view.html'
		}).
		state('sponsors.create', {
			url: '/create',
			templateUrl: 'modules/sponsors/views/create-sponsor.client.view.html'
		}).
		state('sponsors.view', {
			url: '/:sponsorId',
			templateUrl: 'modules/sponsors/views/view-sponsor.client.view.html'
		}).
		state('sponsors.edit', {
			url: '/:sponsorId/edit',
			templateUrl: 'modules/sponsors/views/edit-sponsor.client.view.html'
		});
	}
]);