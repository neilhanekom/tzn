'use strict';

//Setting up route
angular.module('lefts').config(['$stateProvider',
	function($stateProvider) {
		// Lefts state routing
		$stateProvider.
		state('lefts', {
			abstract: true,
			url: '/lefts',
			template: '<ui-view/>'
		}).
		state('lefts.list', {
			url: '',
			templateUrl: 'modules/lefts/views/list-lefts.client.view.html'
		}).
		state('lefts.create', {
			url: '/create',
			templateUrl: 'modules/lefts/views/create-left.client.view.html'
		}).
		state('lefts.view', {
			url: '/:leftId',
			templateUrl: 'modules/lefts/views/view-left.client.view.html'
		}).
		state('lefts.edit', {
			url: '/:leftId/edit',
			templateUrl: 'modules/lefts/views/edit-left.client.view.html'
		});
	}
]);