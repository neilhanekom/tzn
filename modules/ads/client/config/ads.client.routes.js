'use strict';

//Setting up route
angular.module('ads').config(['$stateProvider',
	function($stateProvider) {
		// Ads state routing
		$stateProvider.
		state('ads', {
			abstract: true,
			url: '/ads',
			template: '<section data-ui-view flex layout="row" layout-wrap></section>'
		}).
		state('ads.list', {
			url: '',
			templateUrl: 'modules/ads/views/list-ads.client.view.html'
		}).
		state('ads.create', {
			url: '/create',
			templateUrl: 'modules/ads/views/create-ad.client.view.html'
		}).
		state('ads.view', {
			url: '/:adId',
			templateUrl: 'modules/ads/views/view-ad.client.view.html'
		}).
		state('ads.edit', {
			url: '/:adId/edit',
			templateUrl: 'modules/ads/views/edit-ad.client.view.html'
		});
	}
]);