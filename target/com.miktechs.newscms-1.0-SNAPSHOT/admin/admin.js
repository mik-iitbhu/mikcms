/*global angular*/
(function () {
    "use strict";

    var app = angular.module('Admin', ['ng-admin', 'ng-admin.jwt-auth']);

    app.controller('main', function ($scope, $rootScope, $location) {
        $rootScope.$on('$stateChangeSuccess', function () {
            $scope.displayBanner = $location.$$path === '/dashboard';
        });
    });
	
	

    app.config(['NgAdminConfigurationProvider', 'RestangularProvider', 'ngAdminJWTAuthConfiguratorProvider', function (NgAdminConfigurationProvider, RestangularProvider, ngAdminJWTAuthConfigurator) {
        var nga = NgAdminConfigurationProvider;
        
        var title = 'UPKiKhabar';

		ngAdminJWTAuthConfigurator.setJWTAuthURL('/admin/login');
		ngAdminJWTAuthConfigurator.setCustomLoginTemplate('login.html');
		ngAdminJWTAuthConfigurator.setCustomAuthHeader({
			name: 'Authorization',
			template: 'Bearer {{token}}'
		});

		
        function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        // use the custom query parameters function to format the API request correctly
        RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
            if (operation == "getList") {
                // custom pagination params
                if (params._page) {
                    params._start = (params._page - 1) * params._perPage;
                    params._end = params._page * params._perPage;
                }
                delete params._page;
                delete params._perPage;
                // custom sort params
                if (params._sortField) {
                    params._sort = params._sortField;
                    delete params._sortField;
                }
                // custom filters
                if (params._filters) {
                    for (var filter in params._filters) {
                        params[filter] = params._filters[filter];
                    }
                    delete params._filters;
                }
            }
            return { params: params };
        });

	        var admin = nga.application(title) // application main title
	            .debug(false) // debug disabled
	            .baseApiUrl('/secure/admin/'); // main API endpoint
	      
	      var user = nga.entity('users');
	      var cat = nga.entity('categories');

        // define all entities at the top to allow references between them
        var post = nga.entity('posts'); // the API endpoint for posts will be http://ng-admin.marmelab.com:8000posts/:id

        var trending = nga.entity('trendings')
            .baseApiUrl('/') // The base API endpoint can be customized by entity
            .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

        var tag = nga.entity('tags')
            .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

        // set the application entities
        admin
        	.addEntity(user)
        	.addEntity(cat)
            .addEntity(post)
            .addEntity(tag)
            .addEntity(trending);

	      // set the fields of the user entity list view
	      user.listView().fields([
	          nga.field('id'),                  
	          nga.field('name').isDetailLink(true),
	          nga.field('email'),
	          nga.field('role')
	      ]);
	      
	      user.creationView().fields([
                  nga.field('name'),
                  nga.field('email', 'email'),
                  nga.field('password', 'password')
              ]);
	   // use the same fields for the editionView as for the creationView
	      user.editionView().fields(user.creationView().fields());
	      
	      // set the fields of the cat entity list view
	      cat.listView().fields([
	          nga.field('id'),                  
	          nga.field('name').isDetailLink(true),
	          nga.field('description')
	      ]);
	      
	      cat.creationView().fields([
                  nga.field('name'),
                  nga.field('description'),
                  nga.field('seoUrl'),
                  nga.field('parent'),
                  nga.field('disabled')
              ]);
	   
	      cat.editionView().fields(cat.creationView().fields());
        
        // customize entities and views
        post.listView()
            .title('All News') // default title is "[Entity_name] list"
            .description('List of posts with infinite pagination') // description appears under the title
            .infinitePagination(true) // load pages as the user scrolls
            .fields([
                nga.field('id').label('id'), // The default displayed name is the camelCase field name. label() overrides id
                nga.field('title'), // the default list field type is "string", and displays as a string
                nga.field('published_at', 'date'),  // Date field type allows date formatting
                nga.field('average_note', 'float'), // Float type also displays decimal digits
                nga.field('views', 'number'),
                nga.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
                    .targetEntity(tag) // the tag entity is defined later in this file
                    .targetField(nga.field('name')) // the field to be displayed in this list
            ])
            .listActions(['show', 'edit', 'delete']);

        post.creationView()
            .fields([
                nga.field('title') // the default edit field type is "string", and displays as a text input
                    .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
                    .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
                nga.field('teaser', 'text'), // text field type translates to a textarea
                nga.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
                nga.field('published_at', 'date') // Date field type translates to a datepicker
            ]);

        var subCategories = [
            { category: 'tech', label: 'Computers', value: 'computers' },
            { category: 'tech', label: 'Gadgets', value: 'gadgets' },
            { category: 'lifestyle', label: 'Travel', value: 'travel' },
            { category: 'lifestyle', label: 'Fitness', value: 'fitness' }
        ];

        post.editionView()
            .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
            .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
            .fields([
                post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
                nga.field('category', 'choice') // a choice field is rendered as a dropdown in the edition view
                    .choices([ // List the choice as object literals
                        { label: 'Tech', value: 'tech' },
                        { label: 'Lifestyle', value: 'lifestyle' }
                    ]),
                nga.field('subcategory', 'choice')
                    .choices(function(entry) { // choices also accepts a function to return a list of choices based on the current entry
                        return subCategories.filter(function (c) {
                            return c.category === entry.values.category
                        });
                    }),
                nga.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
                    .targetEntity(tag)
                    .targetField(nga.field('name'))
                    .filters(function(search) {
                        return search ? { q: search } : null;
                    })
                    .remoteComplete(true, { refreshDelay: 300 })
                    .cssClasses('col-sm-4'), // customize look and feel through CSS classes
                nga.field('pictures', 'json'),
                nga.field('views', 'number')
                    .cssClasses('col-sm-4'),
                nga.field('average_note', 'float')
                    .cssClasses('col-sm-4')
  
            ]);

        post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
            .fields([
                nga.field('id'),
                post.editionView().fields(), // reuse fields from another view in another order
                nga.field('custom_action', 'template')
                    .label('')
                    .template('<send-email post="entry"></send-email>')
            ]);


        trending.listView()
            .title('Top Ten')
            .perPage(10) // limit the number of elements displayed per page. Default is 30.
            .fields([
                nga.field('created_at', 'date')
                    .label('Published At'),
                nga.field('text')
                    .label('Text')
            ]);
            

        trending.creationView()
            .fields([
                nga.field('created_at', 'date')
                    .label('Published At'),
                nga.field('text')
                    .label('Text')
                   ]);
        trending.editionView()
            .fields(trending.creationView().fields())
            .fields([nga.field(null, 'template')
                .label('')
                .template('<post-link entry="entry"></post-link>') // template() can take a function or a string
            ]);

        trending.deletionView()
            .title('Deletion confirmation'); // customize the deletion confirmation message


        tag.listView()
            .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
            .fields([
                nga.field('id').label('ID'),
                nga.field('name'),
                nga.field('published', 'boolean').cssClasses(function(entry) { // add custom CSS classes to inputs and columns
                    if (entry.values.published) {
                        return 'bg-success text-center';
                    }
                    return 'bg-warning text-center';
                }),
                nga.field('custom', 'template')
                    .label('Upper name')
                    .template('{{ entry.values.name.toUpperCase() }}')
            ])
            .batchActions([]) // disable checkbox column and batch delete
            .listActions(['show']);

        tag.showView()
            .fields([
                nga.field('name'),
                nga.field('published', 'boolean')
            ]);

        // customize header
        var customHeaderTemplate =
        '<div class="navbar-header">' +
            '<a class="navbar-brand" href="#" ng-click="appController.displayHome()">'+title+'</a>' +
        '</div>' +
        '<p class="navbar-text navbar-right">' +
            '<a href="/" target="_blank"><span class="glyphicon glyphicon-sunglasses"></span>&nbsp;Go To Website</a>' +
        '</p>';
        admin.header(customHeaderTemplate);

        // customize menu
        admin.menu(nga.menu()
        		.addChild(nga.menu(user).title('Users').icon('<span class="fa fa-users"></span>')) // customize the entity menu icon
        		.addChild(nga.menu(cat).title('News Category').icon('<span class="fa fa-briefcase"></span>')) // customize the entity menu icon	
            .addChild(nga.menu(post).title('News').icon('<span class="glyphicon glyphicon-file"></span>')) // customize the entity menu icon
            .addChild(nga.menu(trending).title('Top Ten News').icon('<span class="fa fa-tint"></span>')) // you can even use utf-8 symbols!
            .addChild(nga.menu(tag).title('News Tags').icon('<span class="glyphicon glyphicon-tags"></span>'))
			.addChild(nga.menu().title('Logout').icon('<span class="glyphicon glyphicon-log-out"></span>').link('/logout'))
        );

        // customize dashboard
        var customDashboardTemplate =
        '<div class="row dashboard-starter"></div>' +
        '<div class="row dashboard-content"><div class="col-lg-12"><div class="alert alert-info">' +
            'Welcome to UPKIKHABAR>COM' +
        '</div></div></div>' +
        '<div class="row dashboard-content">' +
            '<div class="col-lg-12">' +
                '<div class="panel panel-default">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.trending" entries="dashboardController.entries.trending"></ma-dashboard-panel>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="row dashboard-content">' +
            '<div class="col-lg-6">' +
                '<div class="panel panel-green">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.recent_posts" entries="dashboardController.entries.recent_posts"></ma-dashboard-panel>' +
                '</div>' +
                '<div class="panel panel-green">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.popular_posts" entries="dashboardController.entries.popular_posts"></ma-dashboard-panel>' +
                '</div>' +
            '</div>' +
            '<div class="col-lg-6">' +
                '<div class="panel panel-yellow">' +
                    '<ma-dashboard-panel collection="dashboardController.collections.tags" entries="dashboardController.entries.tags"></ma-dashboard-panel>' +
                '</div>' +
            '</div>' +
        '</div>';
        admin.dashboard(nga.dashboard()
            .addCollection(nga.collection(post)
                .name('recent_posts')
                .title('Recent News')
                .perPage(5) // limit the panel to the 5 latest posts
                .fields([
                    nga.field('published_at', 'date').label('Published').format('MMM d'),
                    nga.field('title').isDetailLink(true).map(truncate),
                    nga.field('views', 'number')
                ])
                .sortField('published_at')
                .sortDir('DESC')
                .order(1)
            )
            .addCollection(nga.collection(post)
                .name('popular_posts')
                .title('Popular News')
                .perPage(5) // limit the panel to the 5 latest posts
                .fields([
                    nga.field('published_at', 'date').label('Published').format('MMM d'),
                    nga.field('title').isDetailLink(true).map(truncate),
                    nga.field('views', 'number')
                ])
                .sortField('views')
                .sortDir('DESC')
                .order(3)
            )
            .addCollection(nga.collection(trending)
                .title('Top Ten')
                .perPage(10)
                .fields([
                    nga.field('created_at', 'date')
                        .label('Published At'),
                    nga.field('text', '')
                        .label('Text')
                ])
                .sortField('created_at')
                .sortDir('DESC')
                .order(2)
            )
            .addCollection(nga.collection(tag)
                .title('Tags publication status')
                .perPage(10)
                .fields([
                    nga.field('name'),
                    nga.field('published', 'boolean').label('Is published ?')
                ])
                .listActions(['show'])
                .order(4)
            )
            .template(customDashboardTemplate)
        );

        nga.configure(admin);
    }]);

    app.directive('postLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: { entry: '&' },
            template: '<p class="form-control-static"><a ng-click="displayPost()">View&nbsp;post</a></p>',
            link: function (scope) {
                scope.displayPost = function () {
                    $location.path('/posts/show/' + scope.entry().values.post_id);
                };
            }
        };
    }]);

    app.directive('sendEmail', ['$location', function ($location) {
        return {
            restrict: 'E',
            scope: { post: '&' },
            template: '<a class="btn btn-default" ng-click="send()">Send post by email</a>',
            link: function (scope) {
                scope.send = function () {
                    $location.path('/sendPost/' + scope.post().values.id);
                };
            }
        };
    }]);

    // custom 'send post by email' page

    function sendPostController($stateParams, notification) {
        this.postId = $stateParams.id;
        // notification is the service used to display notifications on the top of the screen
        this.notification = notification;
    }
    sendPostController.prototype.sendEmail = function() {
        if (this.email) {
            this.notification.log('Email successfully sent to ' + this.email, {addnCls: 'humane-flatty-success'});
        } else {
            this.notification.log('Email is undefined', {addnCls: 'humane-flatty-error'});
        }
    };
    sendPostController.$inject = ['$stateParams', 'notification'];

    var sendPostControllerTemplate =
        '<div class="row"><div class="col-lg-12">' +
            '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
            '<div class="page-header">' +
                '<h1>Send post #{{ controller.postId }} by email</h1>' +
                '<p class="lead">You can add custom pages, too</p>' +
            '</div>' +
        '</div></div>' +
        '<div class="row">' +
            '<div class="col-lg-5"><input type="text" size="10" ng-model="controller.email" class="form-control" placeholder="name@example.com"/></div>' +
            '<div class="col-lg-5"><a class="btn btn-default" ng-click="controller.sendEmail()">Send</a></div>' +
        '</div>';

    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('send-post', {
            parent: 'main',
            url: '/sendPost/:id',
            params: { id: null },
            controller: sendPostController,
            controllerAs: 'controller',
            template: sendPostControllerTemplate
        });
    }]);

    // custom page with menu item
    var customPageTemplate = '<div class="row"><div class="col-lg-12">' +
            '<ma-view-actions><ma-back-button></ma-back-button></ma-view-actions>' +
            '<div class="page-header">' +
                '<h1>Stats</h1>' +
                '<p class="lead">You can add custom pages, too</p>' +
            '</div>' +
        '</div></div>';
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('stats', {
            parent: 'main',
            url: '/stats',
            template: customPageTemplate
        });
    }]);

}());