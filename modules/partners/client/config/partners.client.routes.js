'use strict';

//Setting up route
angular.module('partners').config(['$stateProvider',
	function($stateProvider) {
		// Partners state routing
		$stateProvider.
		state('partners', {
			abstract: true,
			url: '/partners',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('partners.list', {
			url: '',
			templateUrl: 'modules/partners/views/list-partners.client.view.html'
		}).
		state('partners.create', {
			url: '/create',
			templateUrl: 'modules/partners/views/create-partner.client.view.html'
		}).
		state('partners.view', {
			url: '/:partnerId',
			templateUrl: 'modules/partners/views/view-partner.client.view.html'
		}).
		state('partners.edit', {
			url: '/:partnerId/edit',
			templateUrl: 'modules/partners/views/edit-partner.client.view.html'
		});
	}
]);