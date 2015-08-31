'use strict';
(function(){
  angular.module('app.controllers', 
    ['firebase', 
     'app.directives',
     'app.services.backend', 
     'app.services.schema',  
     'app.services.auth'])
      .controller('DashboardCtrl', DashboardCtrl)
      .controller('MainCtrl', MainCtrl)
      .controller('QueryCtrl', QueryCtrl);
  
  /*========================
        MAIN
  ========================*/ 
  
  function MainCtrl($rootScope, $scope, $location, Backend, Auth){
    //console.clear(); 
    
    $scope.user = Auth.getUser();
    
    $scope.login = function(email, password){
      Backend.login(email, password).then(function(authData){
        // 1. set user locally (service & sessionStorage)
        var user = {
          email    : authData.password.email,
          uid      : authData.uid,
          expires  : authData.expires,
          provider : authData.provider,
          token    : authData.token
        };
        console.log('user saved locally: ', JSON.stringify(user, null, 2));
        Auth.setUser(user);
        // 2. redirect to /route
        $location.path('/dashboard');
      });
    };
    
    $scope.logout = function(){
      // 1. delete user locally
      Auth.logOut();
      $scope.user = null;
      $location.path("/login");
      // 2. backend logout
      Backend.logout();
    };
    
  };
  
  /*========================
        QUERIES
  ========================*/
  
  function QueryCtrl($scope, Backend){
    $scope.database = "Sorry pal, you need to be a real jedi to see this.";
    Backend.api("/").read(function(db){
      $scope.database = db;
      console.log('database', $scope.database);
    });
    
  }
  
  /*========================
        DASHBOARD
  ========================*/ 
  function DashboardCtrl($scope, $q, $location, $firebase, $timeout, Auth, Backend, Schema, USER, dateFilter){
    //console.clear();
    
    $scope.user = USER;
    
    $scope.interaction = false;
    
    $scope.schema = [];
    
    $scope.refreshSchema = function(){
      Schema.get().then(function(json){
        $scope.schema = json;
        console.log('schema refreshed', $scope.schema);
      });
    };
    
    $scope.refreshSchema();
    
    $scope.add = function(entry, endpoint){
      var _endpoint = entry.name || endpoint;
      
      var entryToSave = {
        name      : entry.name,
        type      : entry.type,
        unit      : entry.unit,
        value     : entry.value,
        timestamp : entry.timestamp 
      };
      if(entry.hasOwnProperty('description') && entry.description != null){
        entryToSave.description = entry.description;
      }
      if(!Backend.isValid(entryToSave)){ 
        console.log('invalid input to save. silly bugger!\n', entryToSave);
        return; 
      }
      $scope.interaction = true;
      
      try{
        Backend.api(_endpoint).add(entryToSave, function(){
          console.log('SAVING ENTRY... \n', JSON.stringify(entryToSave,null,2)); 
          $scope.refreshSchema();
        });
      }catch(e){
        console.log('OOOPS!', e);
      }
      $timeout(function(){
          $scope.interaction = false;
        }, 3000);
    };
    
    $scope.clearDatabase = function(){
      Backend.api("/").clear(function(){
        console.log('database cleaned');
      }, function(){
        console.log('error occured');
      });
    };
    
    $scope.showDatabase = function(){
      Backend.api("/").read(function(content){
        console.log('/PERSONALAPI:\n', JSON.stringify(content, null, 2));
        console.log('/personalapi:\n', content);
      });
    };
    
  }; 
     
      
})();