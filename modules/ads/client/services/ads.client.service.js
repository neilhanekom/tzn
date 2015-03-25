'use strict';

//Ads service used to communicate Ads REST endpoints
angular.module('ads').factory('Ads', ['$resource',
	function($resource) {
		return $resource('api/ads/:adId', { adId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);