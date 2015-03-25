'use strict';

//Lefts service used to communicate Lefts REST endpoints
angular.module('lefts').factory('Lefts', ['$resource',
	function($resource) {
		return $resource('api/lefts/:leftId', { leftId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);