'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$timeout', '$window', '$location', 'Authentication', 'Contacts', '$http', '$compile', '$upload',
	function($scope, $stateParams, $timeout, $window, $location, Authentication, Contacts, $http, $compile, $upload ) {
		$scope.authentication = Authentication;


		// Remove existing Contact
		$scope.remove = function( contact ) {
			if ( contact ) { contact.$remove();

				for (var i in $scope.contacts ) {
					if ($scope.contacts [i] === contact ) {
						$scope.contacts.splice(i, 1);
					}
				}
			} else {
				$scope.contact.$remove(function() {
					$location.path('contacts');
				});
			}
		};

		// Update existing Contact
		$scope.update = function() {
			var contact = $scope.contact ;

			contact.$update(function() {
				$location.path('contacts/' + contact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contacts
		$scope.find = function() {
			$scope.contacts = Contacts.query();
		};

		// Find existing Contact
		$scope.findOne = function() {
			$scope.contact = Contacts.get({ 
				contactId: $stateParams.contactId
			});
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
   				url: 'api/contacts',
				method: 'POST',
				fields: {
					firstName: $scope.contact.firstName,
					lastName: $scope.contact.lastName,
					position: $scope.contact.position,
					mobileNumber: $scope.contact.mobileNumber,
					telephone: $scope.contact.telephone,
					email: $scope.contact.email
				},
				file: file,
				fileFormDataName: 'contactForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('contacts');
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
				// xhr.upload.addcontactListener('abort', function(){console.log('abort complete')}, false);
			});
		};

		function updateUsing$upload(file) {
			file.upload = $upload.upload({
   				url: 'api/contacts/updatefile/' + $scope.contact._id,
				method: 'PUT',
				fields: {
					firstName: $scope.contact.firstName,
					lastName: $scope.contact.lastName,
					position: $scope.contact.position,
					mobileNumber: $scope.contact.mobileNumber,
					telephone: $scope.contact.telephone,
					email: $scope.contact.email
				},
				file: file,
				fileFormDataName: 'contactForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('contacts');
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
				// xhr.upload.addcontactListener('abort', function(){console.log('abort complete')}, false);
			});
		};


		// ============================== end of file upload =======================
	}
]);