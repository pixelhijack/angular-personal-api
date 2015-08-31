"use strict";
angular.module('app', 
    ['firebase', 
    'ngRoute',
    'app.controllers',
    'app.directives',
    'app.services.auth',
    'app.services.backend', 
    'app.services.schema'])
      .config(function($routeProvider){
        $routeProvider
          .when('/dashboard', {
              templateUrl : 'views/dashboard.html',
              controller  : 'DashboardCtrl',
              resolve     : {
                USER: function(Auth){
                  // DEBUG MODE:
                  //return Auth.isLoggedIn();
                  return Auth.fakeUser();
                }
              }
          })
          .when('/login', {
              templateUrl : 'views/login.html',
              controller  : 'MainCtrl'
          })
          .when('/database', {
              templateUrl : 'views/database.html',
              controller  : 'QueryCtrl'
          })
          .otherwise({ 
            redirectTo : '/login' 
          });
        })
        .run(function($rootScope, $location, Auth) {
          console.clear();
          $rootScope.$on("$routeChangeStart", function(event, next, current) {
            if(!Auth.getUser()){
              $location.path("/login");
            }
            if(Auth.getUser() && $location.path() == '/login'){
              $location.path("/dashboard");
            }
          });
        });
