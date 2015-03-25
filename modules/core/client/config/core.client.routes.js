'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		// state('sponsors', {
		// 	url: '/sponsors',
		// 	templateUrl: 'modules/core/views/sponsors.client.view.html'
		// }).
		state('contact', {
			url: '/contact',
			templateUrl: 'modules/core/views/contact.client.view.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/core/views/about.client.view.html'
		}).
		// state('rides', {
		// 	url: '/rides',
		// 	templateUrl: 'modules/core/views/rides.client.view.html'
		// }).
		// state('events', {
		// 	url: '/events',
		// 	templateUrl: 'modules/core/views/events.client.view.html'
		// }).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);