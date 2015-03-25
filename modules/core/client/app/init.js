'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$mdThemingProvider', '$mdIconProvider',
	function($locationProvider, $mdThemingProvider, $mdIconProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');

		$mdThemingProvider.definePalette('afruPrimary', {
            '50': 'F9FBE7',
            '100': 'F0F4C3',
            '200': 'E6EE9C',
            '300': 'DCE775',
            '400': 'D4E157',
            '500': 'CDDC39',
            '600': 'C0CA33',
            '700': 'AFB42B',
            '800': '9E9D24',
            '900': '827717',
            'A100': 'F4FF81',
            'A200': 'EEFF41',
            'A400': 'C6FF00',
            'A700': 'AEEA00',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });

        $mdThemingProvider.definePalette('afruAccent', {
            '50': 'FFEBEE',
            '100': 'FFCDD2',
            '200': 'EF9A9A',
            '300': 'E57373',
            '400': 'EF5350',
            '500': 'F44336',
            '600': 'E53935',
            '700': 'D32F2F',
            '800': 'C62828',
            '900': 'B71C1C',
            'A100': 'FF8A80',
            'A200': 'FFAB40',
            'A400': 'FF1744',
            'A700': 'D50000',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light
            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
             '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });

        $mdThemingProvider.theme('default')
        .primaryPalette('afruPrimary')
        .accentPalette('indigo');

 
        // Register the user `avatar` icons
        $mdIconProvider
            .defaultIconSet('./assets/svg/avatars.svg', 128)
            .icon('menu'       , './assets/svg/menu.svg'        , 24)
            .icon('share'      , './assets/svg/share.svg'       , 24)
            .icon('google_plus', './assets/svg/google_plus.svg' , 512)
            .icon('hangouts'   , './assets/svg/hangouts.svg'    , 512)
            .icon('twitter'    , './assets/svg/twitter.svg'     , 512)
            .icon('phone'      , './assets/svg/phone.svg'       , 512);
            
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
