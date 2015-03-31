'use strict';

angular.module('events').filter('Customdate', [
	function() {
		return function(date) {
			// Customdate directive logic
			// ...

			return moment(date).format('MMMM Do YYYY');
		};
	}
]);