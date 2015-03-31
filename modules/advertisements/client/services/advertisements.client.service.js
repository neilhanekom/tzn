'use strict';

//Advertisements service used to communicate Advertisements REST endpoints
angular.module('advertisements').factory('Advertisements', ['$resource',
	function($resource) {
		return $resource('api/advertisements/:advertisementId', { advertisementId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);