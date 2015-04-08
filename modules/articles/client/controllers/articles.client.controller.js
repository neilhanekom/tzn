'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$timeout', '$window', '$location', 'Authentication', 'Articles', '$http', '$compile', '$upload',
	function($scope, $stateParams, $timeout, $window, $location, Authentication, Articles, $http, $compile, $upload ) {
		$scope.authentication = Authentication;

		$scope.articlesmorethatone = false;

		$scope.countArticles = function() {
			$scope.articles = Articles.query();
			var articlesLen = $scope.articles.length;
			if (articlesLen > 1) {
				$scope.articlesmorethatone = true
			}
		};
		


		
		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
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
		
		$scope.updatePic = function(files) {

			$scope.formUpload = true;
			if (files != null) {
				generateThumbAndUpdate(files[0]);
			}
		};



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
		};

		function generateThumbAndUpdate(file) {
			$scope.errorMsg = null;
			$scope.generateThumb(file);
			updateUsing$upload(file);
		};
		
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
   				url: 'api/articles',
				method: 'POST',
				fields: {
					title: $scope.article.title,
					sub: $scope.article.sub,
					body: $scope.article.body
					
				},
				file: file,
				fileFormDataName: 'articleForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('articles');
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
				// xhr.upload.addarticleListener('abort', function(){console.log('abort complete')}, false);
			});
		}

		function updateUsing$upload(file) {
			file.upload = $upload.upload({
   				url: 'api/articles/updatefile/' + $scope.article._id,
				method: 'PUT',
				fields: {
					title: $scope.article.title,
					sub: $scope.article.sub,
					body: $scope.article.body
					
				},
				file: file,
				fileFormDataName: 'articleForm',
			});

			file.upload.then(function(response) {
				$timeout(function() {
					file.result = response.data;
					$location.path('articles');
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
				// xhr.upload.addarticleListener('abort', function(){console.log('abort complete')}, false);
			});
		}


		// ============================== end of file upload =======================
	}
]);