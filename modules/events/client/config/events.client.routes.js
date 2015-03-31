'use strict';

//Setting up route
angular.module('events').config(['$stateProvider',
	function($stateProvider) {
		// Events state routing
		$stateProvider.
		state('events', {
			abstract: true,
			url: '/events',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('events.list', {
			url: '',
			templateUrl: 'modules/events/views/list-events.client.view.html'
		}).
		state('events.create', {
			url: '/create',
			templateUrl: 'modules/events/views/create-event.client.view.html'
		}).
		state('events.view', {
			url: '/:eventId',
			templateUrl: 'modules/events/views/view-event.client.view.html'
		}).
		state('events.edit', {
			url: '/:eventId/edit',
			templateUrl: 'modules/events/views/edit-event.client.view.html'
		});
	}
]);