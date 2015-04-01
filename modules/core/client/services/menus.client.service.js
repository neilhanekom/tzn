'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

    function() {
        // Define a set of default roles
        this.defaultRoles = ['*'];

        // Define the menus object
        this.menus = {};

        // A private function for rendering decision 
        var shouldRender = function(user) {
            // we bring in the authentication service user object

            // we test if user exists
            if (user) {
                // We check the index of roles that exist in addMenu, addMenuItem, addSubMenuItem
                if (!!~this.roles.indexOf('*')) {
                    return true;
                } else {
                    for (var userRoleIndex in user.roles) {
                        for (var roleIndex in this.roles) {
                            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                                return true;
                            }
                        }
                    }
                }
            } else {
                return this.isPublic;
            }

            return false;
        };

        // Validate menu existance
        this.validateMenuExistance = function(menuId) {
            if (menuId && menuId.length) {
                if (this.menus[menuId]) {
                    return true;
                } else {
                    throw new Error('Menu does not exists');
                }
            } else {
                throw new Error('MenuId was not provided');
            }

            return false;
        };

        // Get the menu object by menu id
        this.getMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            return this.menus[menuId];
        };

        // Add new menu object by menu id
        this.addMenu = function(menuId, options) {
            options = options || {};

            // Create the new menu
            this.menus[menuId] = {
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? true : options.isPublic),
                roles: options.roles,
                items: options.items || [],
                shouldRender: shouldRender
            };

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenu = function(menuId) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Return the menu object
            delete this.menus[menuId];
        };

        // Add menu item object
        this.addMenuItem = function(menuId, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Push new menu item
            this.menus[menuId].items.push({
                icon: options.icon,
                title: options.title || '',
                state: options.state || '',
                type: options.type || 'item',
                class: options.class,
                isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].isPublic : options.isPublic),
                roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].roles : options.roles),
                position: options.position || 0,
                items: [],
                shouldRender: shouldRender
            });

            // Add submenu items
            if (options.items) {
                for (var i in options.items) {
                    this.addSubMenuItem(menuId, options.link, options.items[i]);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Add submenu item object
        this.addSubMenuItem = function(menuId, parentItemState, options) {
            options = options || {};

            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].state === parentItemState) {
                    // Push new submenu item
                    this.menus[menuId].items[itemIndex].items.push({
                        title: options.title || '',
                        state: options.state|| '',
                        isPublic: ((options.isPublic === null || typeof options.isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : options.isPublic),
                        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
                        position: options.position || 0,
                        shouldRender: shouldRender
                    });
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeMenuItem = function(menuId, menuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
                    this.menus[menuId].items.splice(itemIndex, 1);
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // Remove existing menu object by menu id
        this.removeSubMenuItem = function(menuId, submenuItemURL) {
            // Validate that the menu exists
            this.validateMenuExistance(menuId);

            // Search for menu item to remove
            for (var itemIndex in this.menus[menuId].items) {
                for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
                    if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
                        this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
                    }
                }
            }

            // Return the menu object
            return this.menus[menuId];
        };

        // ======================================================================== Top Bar Menus ===================================================

        this.addMenu('topbar', {
            isPublic: true,
            roles: ['user' , 'admin' ]

        });

        this.addMenuItem('topbar', {
            icon: 'home',
            title: 'Home',
            state: 'home',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 0,
        });


        this.addMenuItem('topbar', {
            icon: 'local_attraction',
            title: 'Events',
            state: 'events.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 1,
        });
        
        // this.addMenuItem('topbar', {
        //     icon: 'local_library',
        //     title: 'Entries',
        //     state: 'entries.view',
        //     class: 'sidenav-icon',
        //     isPublic: true,
        //     roles: ['user' , 'admin'],
        //     position: 3,
        // });

         this.addMenuItem('topbar', {
            icon: 'phone_in_talk',
            title: 'News',
            state: 'articles.list',
            class: 'sidenav-icon',
            isPublic: true,
            // roles: ['user' , 'admin'],
            position: 2,
        });

         this.addMenuItem('topbar', {
            icon: 'phone_in_talk',
            title: 'Partners',
            state: 'partners.list',
            class: 'sidenav-icon',
            isPublic: true,
            // roles: ['user' , 'admin'],
            position: 3,
        });

         this.addMenuItem('topbar', {
            icon: 'phone_in_talk',
            title: 'Grabba Cycles',
            state: 'grabbas.list',
            class: 'sidenav-icon',
            isPublic: true,
            // roles: ['user' , 'admin'],
            position: 4,
        });

        this.addMenuItem('topbar', {
            icon: 'phone_in_talk',
            title: 'Contact',
            state: 'contacts.list',
            class: 'sidenav-icon',
            isPublic: true,
            // roles: ['user' , 'admin'],
            position: 5,
        });

        

        this.addMenuItem('topbar', {
            icon: 'stars',
            title: 'entries',
            state: 'entries.list',
            class: 'sidenav-icon',
            isPublic: true,
            // roles: ['user' , 'admin'],
            position: 6,
        });

        this.addMenuItem('topbar', {
            icon: 'thumb_up',
            title: 'sponsors',
            state: 'sponsors.list',
            class: 'sidenav-icon',
            isPublic: false,
            roles: ['user' , 'admin'],
            position: 7,
        });

        // ADMIN USERS

        // this.addMenuItem('topbar', {
        //     icon: 'home',
        //     title: 'Dashboard',
        //     state: 'home',
        //     class: 'sidenav-icon',
        //     isPublic: false,
        //     roles: ['user' , 'admin'],
        //     position: 0,
        // });

        

        // ======================================================================== Sidebar-Items ===================================================


        //Adding the topbar menu

        this.addMenu('sidenav', {
            isPublic: true,
            roles: ['user' , 'admin' ]

        });

        //   ===========    Messages   ===========

        this.addMenuItem('sidenav', {
            icon: 'home',
            title: 'Home',
            state: 'home',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 0,
        });


        this.addMenuItem('sidenav', {
            icon: 'local_attraction',
            title: 'Events',
            state: 'events.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 1,
        });
        
        // this.addMenuItem('topbar', {
        //     icon: 'local_library',
        //     title: 'Entries',
        //     state: 'entries.view',
        //     class: 'sidenav-icon',
        //     isPublic: true,
        //     roles: ['user' , 'admin'],
        //     position: 3,
        // });

         this.addMenuItem('sidenav', {
            icon: 'local_library',
            title: 'News',
            state: 'articles.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 2,
        });

         this.addMenuItem('sidenav', {
            icon: 'group',
            title: 'Partners',
            state: 'partners.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 3,
        });

         this.addMenuItem('sidenav', {
            icon: 'directions_bike',
            title: 'Grabba Cycles',
            state: 'grabbas.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 4,
        });

        

        

        this.addMenuItem('sidenav', {
            icon: 'assignment_turned_in',
            title: 'entries',
            state: 'entries.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 5,
        });

        this.addMenuItem('sidenav', {
            icon: 'phone_in_talk',
            title: 'Contact',
            state: 'contacts.list',
            class: 'sidenav-icon',
            isPublic: true,
            roles: ['user' , 'admin'],
            position: 6,
        });

        this.addMenuItem('sidenav', {
            icon: 'thumb_up',
            title: 'sponsors',
            state: 'sponsors.list',
            class: 'sidenav-icon',
            isPublic: false,
            roles: ['user' , 'admin'],
            position: 7,
        });
        
        // this.addMenuItem('sidenav', {
        //     icon: 'view_module',
        //     title: 'Dashboard',
        //     state: 'home',
        //     class: 'sidenav-icon',
        //     isPublic: false,
        //     roles: ['user' , 'admin'],
        //     position: 0,
        // });

        



    }
]);
