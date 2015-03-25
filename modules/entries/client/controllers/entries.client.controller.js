'use strict';

// Entries controller
angular.module('entries').controller('EntriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Entries',
	function($scope, $stateParams, $location, Authentication, Entries ) {
		$scope.authentication = Authentication;

		//Confrim Collapse
		$scope.collapseConfirm = true;
		$scope.collapseForm = false;

		$scope.toggleConfirm = function() {
			$scope.collapseConfirm = !$scope.collapseProfile;
		};
		
		//Form Collapse
		$scope.toggleForm = function() {
			$scope.collapseForm = !$scope.collapseProfile;
		};

		$scope.openForm = function() {
			$scope.collapseForm = false;
			$scope.collapseConfirm = true;
		};

		$scope.confirm = function() {
			$scope.collapseForm = true;
			$scope.collapseConfirm = false;
			
		};

		$scope.raceFee = 200;
		$scope.licenseFee = 35;

		$scope.calculateTotal = function() {
			if ($scope.entry.license.exist === 'no') {
				$scope.license = $scope.licenseFee;
			} else {
				$scope.licenseFee = 0;
			}
			$scope.entry.fee = $scope.raceFee + $scope.licenseFee;
		};

		//Create new Entry
		$scope.create = function() {
			// Create new Entry object
			var entry = new Entries ({
				title: this.entry.title,
				gender: this.entry.gender,
				firstName: this.entry.firstName,
				lastName: this.entry.lastName,
				rsaId: this.entry.rsaId,
				birthDate: this.entry.birthDate,
				mobileNumber: this.entry.mobileNumber,
				email: this.entry.email,
				emergency: this.entry.emergency,
				medical: this.entry.medical,
				postal: this.entry.postal,
				club: this.entry.club,
				license: this.entry.license,
				age_cat: this.entry.age_cat,
				race: this.entry.race
			});

			// Redirect after save
			entry.$save(function(response) {
				$location.path('entries/' + response._id);

				// Clear form fields
				// $scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Entry
		$scope.remove = function( entry ) {
			if ( entry ) { entry.$remove();

				for (var i in $scope.entries ) {
					if ($scope.entries [i] === entry ) {
						$scope.entries.splice(i, 1);
					}
				}
			} else {
				$scope.entry.$remove(function() {
					$location.path('entries');
				});
			}
		};

		// Update existing Entry
		$scope.update = function() {
			var entry = $scope.entry ;

			entry.$update(function() {
				$location.path('entries/' + entry._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Entries
		$scope.find = function() {
			$scope.entries = Entries.query();
		};

		// Find existing Entry
		$scope.findOne = function() {
			$scope.entry = Entries.get({ 
				entryId: $stateParams.entryId
			});
			console.log($scope.entry);
		};
	}
]);