'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$resource',
	function($resource) {
		return $resource('api/events/:eventId', { eventId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			get: {
				method: 'GET',
				transformResponse: function(data){
                //MESS WITH THE DATA
                data = angular.fromJson(data);
                
                data.eventDate = new Date(data.eventDate);
                return data;
            	}
			}
		});
	}
]);