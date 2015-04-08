'use strict';

// Advertisements controller
angular.module('advertisements').controller('AdvertisementsController', ['$timeout', '$scope', '$stateParams', '$window', 'Sponsors', '$location', 'Authentication', 'Advertisements', '$http', '$compile', '$upload', 
	function($timeout, $scope, $stateParams, $window, Sponsors, $location, Authentication, Advertisements, $http, $compile, $upload ) {
		$scope.authentication = Authentication;



		$scope.selSponsors = [];

		$scope.addSponsor = function(sponsor) {
		    $scope.selSponsors.push(sponsor);
		    console.log($scope.selSponsors);
		};

		$scope.removeSponsor = function(sponsor) {
			var index = $scope.selSponsors.indexOf(sponsor);
		    $scope.selSponsors.splice(index, 1);
		};

		$scope.specifications = [];

		$scope.pushSpec = function() {
		 	var key = $scope.specification.key;
		 	var value = $scope.specification.value;
		    $scope.specifications.push({key: key, value: value});
		    $scope.specification.key = '';
		    $scope.specification.value = '';
		  };

		  $scope.removeSpec = function(specToRemove) {
		    var index = $scope.specifications.indexOf(specToRemove);
		    $scope.specifications.splice(index, 1);
		  };


		  $scope.loadSponsors = function() {
		    // Use timeout to simulate a 650ms request.
		    $scope.sponsors = [];
		    return $timeout(function() {
		      $scope.sponsors = Sponsors.query();
		    }, 650);
		  };

		  

		// Remove existing Advertisement
		$scope.remove = function( advertisement ) {
			if ( advertisement ) { advertisement.$remove();

				for (var i in $scope.advertisements ) {
					if ($scope.advertisements [i] === advertisement ) {
						$scope.advertisements.splice(i, 1);
					}
				}
			} else {
				$scope.advertisement.$remove(function() {
					$location.path('advertisements');
				});
			}
		};

		// Update existing Advertisement
		$scope.update = function() {
			var advertisement = $scope.advertisement ;

			advertisement.$update(function() {
				$location.path('advertisements/' + advertisement._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Advertisements
		$scope.find = function() {
			$scope.advertisements = Advertisements.query();
			console.log($scope.advertisements);
		};

		// Find existing Advertisement
		$scope.findOne = function() {
			$scope.advertisement = Advertisements.get({ 
				advertisementId: $stateParams.advertisementId
			});

			$timeout(function() {
					if ($scope.advertisement.specifications[0]) {
						angular.forEach($scope.advertisement.specifications, function(obj) {
						  $scope.specifications.push(obj);
						});
					}
			}, 650);

			$timeout(function() {
					if ($scope.advertisement.sponsors[0]) {
						angular.forEach($scope.advertisement.sponsors, function(obj) {
						  $scope.selSponsors.push(obj);
						});
					}
			}, 650);
			
		};

		// ==============================  File Upload ============================

	
		$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

		$scope.$watch('files', function(files) {
			$scope.formUpload = false;
			if (files != null) {
				for (var i = 0; i < files.length; i++) {
					$scope.errorMsg = null;
					(function(file) {
						generateThumbAndUpload(file);
					})(files[i]);
				}
			}
		});
		
		$scope.uploadPic = function(files) {

			$scope.formUpload = true;
			if (files != null) {
				generateThumbAndUpload(files[0]);
			}
		};
		
		function generateThumbAndUpload(file) {
			$scope.errorMsg = null;
			$scope.generateThumb(file);
			uploadUsing$upload(file);
		}

		$scope.updatePic = function(files) {

			$scope.formUpload = true;
			if (files != null) {
				generateThumbAndUpdate(files[0]);
			}
		};
		
		function generateThumbAndUpdate(file) {
			$scope.errorMsg = null;
			$scope.generateThumb(file);
			updateUsing$upload(file);
		}
		
		$scope.generateThumb = function(file) {
			if (file != null) {
				if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
					$timeout(function() {
						var fileReader = new FileReader();
						fileReader.readAsDataURL(file);
						fileReader.onload = function(e) {
							$timeout(function() {
								file.dataUrl = e.target.result;
							});
						}
					});
				}
			}
		};
		
		function uploadUsing$upload(file) {
			file.upload = $upload.upload({
   				url: 'api/advertisements',
				method: 'POST',
				fields: {
					type: $scope.advertisement.type,
					title: $scope.advertisement.title,
					description: $scope.advertisement.description,
					specifications: $scope.specifications,
					sponsors: $scope.selSponsors
				},
				file: file,
				fileFormDataName: 'advertisementForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('advertisements');
				});
			}, function(response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			});

			file.upload.progress(function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

			file.upload.xhr(function(xhr) {
				// xhr.upload.addadvertisementListener('abort', function(){console.log('abort complete')}, false);
			});
		};

		function updateUsing$upload(file) {
			file.upload = $upload.upload({
   				url: 'api/advertisements/updatefile/' + $scope.advertisement._id,
				method: 'PUT',
				fields: {
					type: $scope.advertisement.type,
					title: $scope.advertisement.title,
					description: $scope.advertisement.description,
					specifications: $scope.specifications,
					sponsors: $scope.selSponsors
				},
				file: file,
				fileFormDataName: 'advertisementForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('advertisements');
				});
			}, function(response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			});

			file.upload.progress(function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

			file.upload.xhr(function(xhr) {
				// xhr.upload.addadvertisementListener('abort', function(){console.log('abort complete')}, false);
			});
		};


		// ============================== end of file upload =======================
	}
]);