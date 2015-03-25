'use strict';
 
angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$mdBottomSheet', '$log',
    function($scope, Authentication, $mdSidenav, $mdBottomSheet, $log) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
 
 
        /**
         * Main Controller for the Angular Material Starter App
         * @param $scope
         * @param $mdSidenav
         * @param avatarsService
         * @constructor
         */
 
 
        // Load all registered users
 
        // usersService
        //     .loadAll()
        //     .then( function( users ) {
        //         self.users    = [].concat(users);
        //         self.selected = users[0];
        //     });
 
        // *********************************
        // Internal methods
        // *********************************
 
        /**
         * Hide or Show the 'left' sideNav area
         */
        function toggleUsersList() {
            $mdSidenav('left').toggle();
        }
 
        /**
         * Select the current avatars
         * @param menuId
         */
        function selectUser ( user ) {
            self.selected = angular.isNumber(user) ? $scope.users[user] : user;
            self.toggleList();
        }
 
        /**
         * Show the bottom sheet
         */
        function share($event) {
            var user = self.selected;
 
            /**
             * Bottom Sheet controller for the Avatar Actions
             */
            function UserSheetController( $mdBottomSheet ) {
                this.user = user;
                this.items = [
                    { name: 'Phone'       , icon: 'phone'       },
                    { name: 'Twitter'     , icon: 'twitter'     },
                    { name: 'Google+'     , icon: 'google_plus' },
                    { name: 'Hangout'     , icon: 'hangouts'    }
                ];
                this.performAction = function(action) {
                    $mdBottomSheet.hide(action);
                };
            }
 
            $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: 'modules/core/views/contactSheet.html',
                controller: [ '$mdBottomSheet', UserSheetController],
                controllerAs: 'vm',
                bindToController : true,
                targetEvent: $event
            }).then(function(clickedItem) {
                $log.debug( clickedItem.name + ' clicked!');
            });
 
 
        }
 
        var self = this;
 
        self.selected     = null;
        self.users        = [ ];
        self.selectUser   = selectUser;
        self.toggleList   = toggleUsersList;
        self.share        = share;
 
    }
]);



// 'use strict';

// angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$interval', '$mdSidenav',
// 	function($scope, Authentication, $interval, $mdSidenav) {
// 		// This provides Authentication context.
// 		$scope.authentication = Authentication;

// 		$scope.toggleLeft = function() {
//             $mdSidenav('left').toggle();
//         };


//         $scope.collapseProfile = true;
// 		$scope.toggleProfile = function() {
// 			$scope.collapseProfile = !$scope.collapseProfile;

// 		};

// 		$scope.curArt = [];

// 		$scope.articles = [
// 			{'heading' : 'Magoebaskloof Classic', 'body' : 'Tzaneen Cycling presents the Magoebaskloof Classic Race', 'background' : 'modules/core/img/bg/cycle1.jpg'},
// 			{'heading' : 'This is the 2nd Heading', 'body' : 'This is the second body', 'background' : 'modules/core/img/bg/cycle2.jpg'},
// 			{'heading' : 'This is the 3rd Heading', 'body' : 'This is the third body', 'background' : 'modules/core/img/bg/cycle3.jpg'}
// 		];

// 		$scope.startArticles = function() {
// 			var total = $scope.curArt.length;
// 			var index = 0;
// 			if (total === 0) {
// 				$scope.curArt.splice(0, total, $scope.articles[index]);
// 			} 
			
// 		var start = $interval(function() {
// 				//binne in die interval moet ons n check of ons nog onder die totaal is en as ons is gaan voort as ons nie is nie reset die index na 0
// 				var newArt = $scope.articles[index];
// 				var totalArts = $scope.articles.length;
// 				if (newArt === undefined) {
// 					index = 0;
// 	            	$scope.curArt.splice(0, totalArts, $scope.articles[index]);
// 	            	index++;
// 				} else {
// 	            	$scope.curArt.splice(0, totalArts, $scope.articles[index]);
// 	            	index++;
// 				}	
//        		}, 5000);

// 		$scope.stop = function() {
// 				$interval.cancel(start);
// 		};

// 		$scope.$on('$destroy', function() {
// 				$scope.stop();
// 		});
       			
// 		};

		

		

// 		 // stop = $interval(function($scope) {
            
//    //        }, 100);

// 		 // $scope.$on('$destroy', function() {
//    //        // Make sure that the interval is destroyed too
//    //        $scope.stopFight();
//    //      });

// 	}
// ]);