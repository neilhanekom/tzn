'use strict';

//Setting up route
angular.module('entries').config(['$stateProvider',
	function($stateProvider) {
		// Entries state routing
		$stateProvider.
		state('entries', {
			abstract: true,
			url: '/entries',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('entries.list', {
			url: '',
			templateUrl: 'modules/entries/views/list-entries.client.view.html'
		}).
		state('entries.create', {
			url: '/create',
			templateUrl: 'modules/entries/views/create-entry.client.view.html'
		}).
		state('entries.view', {
			url: '/:entryId',
			templateUrl: 'modules/entries/views/view-entry.client.view.html'
		}).
		state('entries.edit', {
			url: '/:entryId/edit',
			templateUrl: 'modules/entries/views/edit-entry.client.view.html'
		});
	}
]);