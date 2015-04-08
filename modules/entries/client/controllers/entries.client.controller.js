'use strict';

// Entries controller
angular.module('entries').controller('EntriesController', ['$scope', '$stateParams', '$location', '$timeout', '$filter', 'Authentication', 'Entries', 'Events', 'deviceDetector',
	function($scope, $stateParams, $location, $timeout, $filter, Authentication, Entries, Events, deviceDetector  ) {
		$scope.authentication = Authentication;

		$scope.deviceDetector = deviceDetector;

		$scope.checkFF = function() {

			if ($scope.deviceDetector.browser === 'firefox') {
				$scope.firefox = true;
			}
		};

		$scope.loadYears = function() {
	    // Use timeout to simulate a 650ms request.
	    $scope.years = [];
	    return $timeout(function() {
	      $scope.years = [
	      	'1950', '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959',
	      	'1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', 
	        '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999',
	        '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'
	      ];
	    }, 1000);
		};

		$scope.loadMonths = function() {
	    // Use timeout to simulate a 650ms request.
	    $scope.months = [];
	    return $timeout(function() {
	      $scope.months = [
	      	{ key: '01', value: 'January'},
	      	{ key: '02', value: 'February'},
	      	{ key: '03', value: 'March'},
	      	{ key: '04', value: 'April'},
	      	{ key: '05', value: 'May'},
	      	{ key: '06', value: 'June'},
	      	{ key: '07', value: 'July'},
	      	{ key: '08', value: 'August'},
	      	{ key: '09', value: 'September'},
	      	{ key: '10', value: 'October'},
	      	{ key: '11', value: 'November'},
	      	{ key: '12', value: 'December'}
	      ];
	    }, 650);
		};

		$scope.loadDays = function() {
	    // Use timeout to simulate a 650ms request.
	    $scope.days = [];
	    return $timeout(function() {
	      $scope.days = [
	        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '28', '29', '30', '31'
	      ];

	    }, 650);
		};

		
		$scope.compileDate = function() {


			$timeout(function() {
		     if ($scope.day && $scope.month && $scope.year) {
				var dt = $scope.year + '-' + $scope.month.key + '-' + $scope.day + 'T08:00:00.000Z';
				
				
				var x = new Date(dt);
				$scope.birthDate = x;
				console.log($scope.birthDate);
			}

		    }, 650);
			
		};



		$scope.success = '#4CAF50';
		$scope.fail = '#F44336';

		// Icons and Colors
		$scope.success = '#CDDC39';

		$scope.bank = {
			accountname: 'Tzaneen Bicycle Club',
			bank: 'Standard Bank',
			accountnumber: 330566652,
			type: 'Cheque/Current',
			branchname: 'Tzaneen',
			branchcode: '05-27-49'

		};

		$scope.loadEvents = function() {
		    // Use timeout to simulate a 650ms request.
		    $scope.event = [];
		    return $timeout(function() {
		      $scope.events = Events.query();

		    }, 650);
		    
		  };

		$scope.findEvent = function() {
         $timeout(function() {
              var events =  $scope.events;
              var reqEvent = $scope.entry.event;
              
              angular.forEach(events, function(evt){
              	
                 if (evt._id === reqEvent) {
                     $scope.fevent = evt;
                 }
              });
            }, 1000);
		
        };  

		$scope.confirmEntry = function() {
			var len = $scope.entry.status.length;
			$scope.entry.status.splice(0, len, 'complete');
		};

		$scope.unconfirmEntry = function() {
			var len = $scope.entry.status.length;
			$scope.entry.status.splice(0, len, 'unpaid');
		};


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


		$scope.raceFee;
		$scope.licenseFee = 35;

		$scope.calculateTotal = function() {
			var dist = $scope.entry.race;
			var licApplicable;
			if (dist === '15km') {
				$scope.raceFee = 80;
			} else if (dist === '40km') {
				$scope.raceFee = 150;
			} else if (dist === '70km') {
				$scope.raceFee = 200;
			}
			if (dist === '15km') {
				licApplicable = false;
			} else {
				licApplicable = true;
			}

			if ($scope.entry.license.exist === 'no' && licApplicable) {
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
				birthDate: $scope.birthDate,
				mobileNumber: this.entry.mobileNumber,
				email: this.entry.email,
				emergency: this.entry.emergency,
				medical: this.entry.medical,
				postal: this.entry.postal,
				club: this.entry.club,
				license: this.entry.license,
				age_cat: this.entry.age_cat,
				race: this.entry.race,
				event: $scope.event._id,
				fee: $scope.entry.fee
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
			
		};

		// $scope.findEvnt = function() {
		// 	$timeout(function() {
		//       	var evnt = $scope.entry.event;
		//       	$scope.evnt = Events.get({
		//       		eventId: evnt
		//       	});
		//       	}
		      	
		//     }, 650);
		// };

		$scope.foundEntry = [];

		$scope.findEntry = function(id) {

			return $timeout(function() {
			     $scope.Entry = Entries.get({ 
					entryId: id
				});
			    $scope.foundEntry.push($scope.Entry);
			    console.log($scope.foundEntry);
		    }, 650);	
		};

		

		
	}
]);