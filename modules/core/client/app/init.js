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
            '50': 'E3F2FD',
            '100': 'BBDEFB',
            '200': '90CAF9',
            '300': '64B5F6',
            '400': '42A5F5',
            '500': '2196F3',
            '600': '1E88E5',
            '700': '1976D2',
            '800': '1565C0',
            '900': '0D47A1',
            'A100': '448AFF',
            'A200': '448AFF',
            'A400': '2979FF',
            'A700': '2962FF',
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
