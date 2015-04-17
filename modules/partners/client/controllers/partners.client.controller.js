'use strict';

// Partners controller
angular.module('partners').controller('PartnersController', ['$scope', '$stateParams', '$timeout', '$window', '$location', 'Authentication', 'Partners', '$http', '$compile', '$upload',
	function($scope, $stateParams, $timeout, $window, $location, Authentication, Partners, $http, $compile, $upload ) {
		$scope.authentication = Authentication;


		$scope.white = '#FFFFFF';


		var icons = ['accessibility', 'alarm', 'aspect_ratio', 'autorenew', 'bookmark_outline', 'dashboard', 'dns', 'favorite_outline', 'get_app', 'highlight_remove', 'history', 'list', 'picture_in_picture', 'print', 'settings_ethernet', 'settings_power', 'shopping_cart', 'spellcheck', 'swap_horiz', 'swap_vert', 'thumb_up', 'thumbs_up_down', 'translate', 'trending_up', 'visibility', 'warning', 'mic', 'play_circle_outline', 'repeat', 'skip_next', 'call', 'chat', 'clear_all', 'dialpad', 'dnd_on', 'forum', 'location_on', 'vpn_key', 'filter_list', 'inbox', 'link', 'remove_circle_outline', 'save', 'text_format', 'access_time', 'airplanemode_on', 'bluetooth', 'data_usage', 'gps_fixed', 'now_wallpaper', 'now_widgets', 'storage', 'wifi_tethering', 'attach_file', 'format_line_spacing', 'format_list_numbered', 'format_quote', 'vertical_align_center', 'wrap_text', 'cloud_queue', 'file_download', 'folder_open', 'cast', 'headset', 'keyboard_backspace', 'mouse', 'speaker', 'watch', 'audiotrack', 'edit', 'brush', 'looks', 'crop_free', 'camera', 'filter_vintage', 'hdr_strong', 'photo_camera', 'slideshow', 'timer', 'directions_bike', 'hotel', 'local_library', 'directions_walk', 'local_cafe', 'local_pizza', 'local_florist', 'my_location', 'navigation', 'pin_drop', 'arrow_back', 'menu', 'close', 'more_horiz', 'more_vert', 'refresh', 'phone_paused', 'vibration', 'cake', 'group', 'mood', 'person', 'notifications_none', 'plus_one', 'school', 'share', 'star_outline'];
        var colors = ['white', 'black', '#F44336', '#2196F3'];
        $scope.cnt = Math.floor(Math.random() * icons.length);
        $scope.icon = icons[$scope.cnt];
        $scope.white = colors[0];
        $scope.black = colors[1];
        $scope.red = colors[2];
        $scope.blue = colors[3];
        $scope.size = 48;

		$scope.contacts = [
		    
		 ];

		 $scope.pushContact = function() {
		 	var name = $scope.contact.name;
		 	var number = $scope.contact.number;
		 	var email = $scope.contact.email;
		    $scope.contacts.push({name: name, number: number, email: email});
		    $scope.contact.name = '';
		    $scope.contact.number = '';
		    $scope.contact.email = '';
		  };

		  $scope.removeContact = function(contactToRemove) {
		    var index = $scope.contacts.indexOf(contactToRemove);
		    $scope.contacts.splice(index, 1);
		  };


		// Create new Partner
		// $scope.create = function() {
		// 	// Create new Partner object
		// 	var partner = new Partners ({
		// 		name: this.name
		// 	});

		// 	// Redirect after save
		// 	partner.$save(function(response) {
		// 		$location.path('partners/' + response._id);

		// 		// Clear form fields
		// 		$scope.name = '';
		// 	}, function(errorResponse) {
		// 		$scope.error = errorResponse.data.message;
		// 	});
		// };

		// Remove existing Partner
		$scope.remove = function( partner ) {
			if ( partner ) { partner.$remove();

				for (var i in $scope.partners ) {
					if ($scope.partners [i] === partner ) {
						$scope.partners.splice(i, 1);
					}
				}
			} else {
				$scope.partner.$remove(function() {
					$location.path('partners');
				});
			}
		};

		// Update existing Partner
		$scope.update = function() {
			var partner = $scope.partner ;

			partner.$update(function() {
				$location.path('partners/' + partner._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Partners
		$scope.find = function() {
			$scope.partners = Partners.query();
		};

		// Find existing Partner
		$scope.findOne = function() {
			$scope.partner = Partners.get({ 
				partnerId: $stateParams.partnerId
			});

			$timeout(function() {
					if ($scope.partner.contacts[0]) {
						angular.forEach($scope.partner.contacts, function(obj) {
						  $scope.contacts.push(obj);
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
   				url: 'api/partners',
				method: 'POST',
				fields: {
					name: $scope.partner.name,
					slogan: $scope.partner.slogan,
					description: $scope.partner.description,
					address: $scope.partner.address,
					contacts: $scope.contacts
				},
				file: file,
				fileFormDataName: 'partnerForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('partners');
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
				// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
			});
		};

		function updateUsing$upload(file) {
			file.upload = $upload.upload({
   				url: 'api/partners/updatefile/' + $scope.partner._id,
				method: 'PUT',
				fields: {
					name: $scope.partner.name,
					slogan: $scope.partner.slogan,
					description: $scope.partner.description,
					address: $scope.partner.address,
					contacts: $scope.contacts
				},
				file: file,
				fileFormDataName: 'partnerForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('partners');
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
				// xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
			});
		};


		// ============================== end of file upload =======================


	}
]);