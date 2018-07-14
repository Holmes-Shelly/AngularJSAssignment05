(function() {
"use strict";
angular.module('common', [])
.constant('ApiPath', 'https://angularjs-course05-learning.herokuapp.com')
.service('MenuService', MenuService)
.factory('loadingHttpInterceptor', LoadingHttpInterceptor)
.component('loading', {
  template: '<img src="images/spinner.svg" ng-if="$ctrl.show">',
  controller: LoadingController
})
.config(['$httpProvider', function($httpProvider){
  $httpProvider.interceptors.push('loadingHttpInterceptor');
}]);

angular.module('public', ['ui.router', 'common'])
.controller('MenuController', MenuController)
.controller('MenuItemsController', MenuItemsController)
.component('menuCategory', {
  //templateUrl: 'src/menu-category.html',
  bindings: {
    category: '<'
  }
})
.component('menuItem', {
  //templateUrl: 'src/menu-item.html',
  bindings: {
    menuItem: '<'
  },
  controller: MenuItemController
})
.config(routeConfig);

angular.module('restaurant', ['public'])
.config(['$urlRouterProvider', function config($urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
}]);

routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
  // Routes
  $stateProvider
    .state('public', {
      abstract: true,
      templateUrl: 'src/public.html'
    })
    .state('public.home', {
      url: '/',
      templateUrl: 'src/home.html'
    })
    .state('public.menu', {
      url: '/menu',
      templateUrl: 'src/menu.html',
      controller: 'MenuController',
      controllerAs: 'menuCtrl',
      resolve: {
        menuCategories: ['MenuService', function (MenuService) {
          return MenuService.getCategories();
        }]
      }
    })
    .state('public.menuitems', {
      url: '/menu/{category}',
      templateUrl: 'src/menu-items.html',
      controller: 'MenuItemsController',
      controllerAs: 'menuItemsCtrl',
      resolve: {
        menuItems: ['$stateParams','MenuService', function ($stateParams, MenuService) {
          return MenuService.getMenuItems($stateParams.category);
        }]
      }
    });
}

MenuItemController.$inject = ['ApiPath'];
function MenuItemController(ApiPath) {
  var $ctrl = this;
  $ctrl.basePath = ApiPath;
}

MenuController.$inject = ['menuCategories'];
function MenuController(menuCategories) {
  var $ctrl = this;
  $ctrl.menuCategories = menuCategories;
}

MenuItemsController.$inject = ['menuItems'];
function MenuItemsController(menuItems) {
  var $ctrl = this;
  $ctrl.menuItems = menuItems;
}

MenuService.$inject = ['$http', 'ApiPath'];
function MenuService($http, ApiPath) {
  var service = this;

  service.getCategories = function () {
    return $http.get(ApiPath + '/categories.json').then(function (response) {
      return response.data;
    });
  };


  service.getMenuItems = function (category) {
    var config = {};
    if (category) {
      config.params = {'category': category};
    }

    return $http.get(ApiPath + '/menu_items.json', config).then(function (response) {
      return response.data;
    });
  };
}

LoadingController.$inject = ['$rootScope'];
function LoadingController ($rootScope) {
  var $ctrl = this;
  var listener;

  $ctrl.$onInit = function() {
    $ctrl.show = false;
    listener = $rootScope.$on('spinner:activate', onSpinnerActivate);
  };

  $ctrl.$onDestroy = function() {
    listener();
  };

  function onSpinnerActivate(event, data) {
    $ctrl.show = data.on;
  }
}

LoadingHttpInterceptor.$inject = ['$rootScope', '$q'];
/**
 * Tracks when a request begins and finishes. When a
 * request starts, a progress event is emitted to allow
 * listeners to determine when a request has been initiated.
 * When the response completes or a response error occurs,
 * we assume the request has ended and emit a finish event.
 */
function LoadingHttpInterceptor($rootScope, $q) {

  var loadingCount = 0;
  var loadingEventName = 'spinner:activate';

  return {
    request: function (config) {
      // console.log("Inside interceptor, config: ", config);

      if (++loadingCount === 1) {
        $rootScope.$broadcast(loadingEventName, {on: true});
      }

      return config;
    },

    response: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }

      return response;
    },

    responseError: function (response) {
      if (--loadingCount === 0) {
        $rootScope.$broadcast(loadingEventName, {on: false});
      }

      return $q.reject(response);
    }
  };
}


})();
