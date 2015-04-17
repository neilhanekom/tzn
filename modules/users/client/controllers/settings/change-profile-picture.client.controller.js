'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', '$location', 'Authentication', '$http', '$compile', '$upload', 
	function ($scope, $timeout, $window, $location, Authentication, $http, $compile, $upload) {
		$scope.user = Authentication.user;
		$scope.imageURL = $scope.user.profileImageURL;

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
   				url: 'api/users/picture',
				method: 'POST',
				fields: {},
				file: file,
				fileFormDataName: 'profileForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$scope.$digest();
					$location.path('home');
					
				}, 350);
			}, function(response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			});

			file.upload.progress(function(evt) {
				// Math.min is to fix IE which reports 200% sometimes
				file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});

			file.upload.xhr(function(xhr) {
				// xhr.upload.addproductListener('abort', function(){console.log('abort complete')}, false);
			});
		};

		
		

		// Create file uploader instance
		// $scope.uploader = new FileUploader({
		// 	url: 'api/users/picture'
		// });

		// // Set file uploader image filter
		// $scope.uploader.filters.push({
		// 	name: 'imageFilter',
		// 	fn: function (item, options) {
		// 		var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
		// 		return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		// 	}
		// });

		// // Called after the user selected a new picture file
		// $scope.uploader.onAfterAddingFile = function (fileItem) {
		// 	if ($window.FileReader) {
		// 		var fileReader = new FileReader();
		// 		fileReader.readAsDataURL(fileItem._file);

		// 		fileReader.onload = function (fileReaderEvent) {
		// 			$timeout(function () {
		// 				$scope.imageURL = fileReaderEvent.target.result;
		// 			}, 0);
		// 		};
		// 	}
		// };

		// // Called after the user has successfully uploaded a new picture
		// $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
		// 	// Show success message
		// 	$scope.success = true;

		// 	// Populate user object
		// 	$scope.user = Authentication.user = response;

		// 	// Clear upload buttons
		// 	$scope.cancelUpload();
		// };

		// // Called after the user has failed to uploaded a new picture
		// $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
		// 	// Clear upload buttons
		// 	$scope.cancelUpload();

		// 	// Show error message
		// 	$scope.error = response.message;
		// };

		// // Change user profile picture
		// $scope.uploadProfilePicture = function () {
		// 	// Clear messages
		// 	$scope.success = $scope.error = null;

		// 	// Start upload
		// 	$scope.uploader.uploadAll();
		// };

		// // Cancel the upload process
		// $scope.cancelUpload = function () {
		// 	$scope.uploader.clearQueue();
		// 	$scope.imageURL = $scope.user.profileImageURL;
		// };
	}
]);
