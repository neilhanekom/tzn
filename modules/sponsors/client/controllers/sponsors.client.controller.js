'use strict';

// Sponsors controller
angular.module('sponsors').controller('SponsorsController', ['$scope', '$stateParams', '$timeout', '$window', '$location', 'Authentication', 'Sponsors', '$http', '$compile', '$upload',
	function($scope, $stateParams, $timeout, $window, $location, Authentication, Sponsors, $http, $compile, $upload ) {
		$scope.authentication = Authentication;

		var icons = ['accessibility', 'alarm', 'aspect_ratio', 'autorenew', 'bookmark_outline', 'dashboard', 'dns', 'favorite_outline', 'get_app', 'highlight_remove', 'history', 'list', 'picture_in_picture', 'print', 'settings_ethernet', 'settings_power', 'shopping_cart', 'spellcheck', 'swap_horiz', 'swap_vert', 'thumb_up', 'thumbs_up_down', 'translate', 'trending_up', 'visibility', 'warning', 'mic', 'play_circle_outline', 'repeat', 'skip_next', 'call', 'chat', 'clear_all', 'dialpad', 'dnd_on', 'forum', 'location_on', 'vpn_key', 'filter_list', 'inbox', 'link', 'remove_circle_outline', 'save', 'text_format', 'access_time', 'airplanemode_on', 'bluetooth', 'data_usage', 'gps_fixed', 'now_wallpaper', 'now_widgets', 'storage', 'wifi_tethering', 'attach_file', 'format_line_spacing', 'format_list_numbered', 'format_quote', 'vertical_align_center', 'wrap_text', 'cloud_queue', 'file_download', 'folder_open', 'cast', 'headset', 'keyboard_backspace', 'mouse', 'speaker', 'watch', 'audiotrack', 'edit', 'brush', 'looks', 'crop_free', 'camera', 'filter_vintage', 'hdr_strong', 'photo_camera', 'slideshow', 'timer', 'directions_bike', 'hotel', 'local_library', 'directions_walk', 'local_cafe', 'local_pizza', 'local_florist', 'my_location', 'navigation', 'pin_drop', 'arrow_back', 'menu', 'close', 'more_horiz', 'more_vert', 'refresh', 'phone_paused', 'vibration', 'cake', 'group', 'mood', 'person', 'notifications_none', 'plus_one', 'school', 'share', 'star_outline'];
        var colors = ['white', 'black', 'wheat', '#cc99ff', '#abcdef'];
        $scope.cnt = Math.floor(Math.random() * icons.length);
        $scope.icon = icons[$scope.cnt];
        $scope.fill = colors[0];
        $scope.black = colors[1];
        $scope.size = 48;

		// Create new Sponsor
		
		// Remove existing Sponsor
		$scope.remove = function( sponsor ) {
			if ( sponsor ) { sponsor.$remove();

				for (var i in $scope.sponsors ) {
					if ($scope.sponsors [i] === sponsor ) {
						$scope.sponsors.splice(i, 1);
					}
				}
			} else {
				$scope.sponsor.$remove(function() {
					$location.path('sponsors');
				});
			}
		};

		// Update existing Sponsor
		$scope.update = function() {
			var sponsor = $scope.sponsor ;

			sponsor.$update(function() {
				$location.path('sponsors/' + sponsor._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sponsors
		$scope.find = function() {
			$scope.sponsors = Sponsors.query();
		};

		// Find existing Sponsor
		$scope.findOne = function() {
			$scope.sponsor = Sponsors.get({ 
				sponsorId: $stateParams.sponsorId
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
   				url: 'api/sponsors',
				method: 'POST',
				fields: {
					name: $scope.sponsor.name,
				},
				file: file,
				fileFormDataName: 'sponsorForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('sponsors');
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
				// xhr.upload.addsponsorListener('abort', function(){console.log('abort complete')}, false);
			});
		}


		// ============================== end of file upload =======================
	}
]);