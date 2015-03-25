'use strict';

//Sponsors service used to communicate Sponsors REST endpoints
angular.module('sponsors').factory('Sponsors', ['$resource',
	function($resource) {
		return $resource('api/sponsors/:sponsorId', { sponsorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);