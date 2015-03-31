'use strict';

//Grabbas service used to communicate Grabbas REST endpoints
angular.module('grabbas').factory('Grabbas', ['$resource',
	function($resource) {
		return $resource('api/grabbas/:grabbaId', { grabbaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);