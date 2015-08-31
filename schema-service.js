'use strict';
(function(){
  angular.module('app.services.schema', [])
         .factory('Schema', Schema)
         .factory('addTimeInterceptor', addTimeInterceptor)
         .config(['$httpProvider', function($httpProvider) {
            //$httpProvider.interceptors.push('addTimeInterceptor'); 
         }]);
  
  function Schema($http){
    return {
      get: function(){
        return $http.get('form-schema.json').then(function(schema){
          schema.data.forEach(function(schemaModel){
            if(schemaModel.hasOwnProperty('timestamp')){
              schemaModel.timestamp = Date.now();
            }
          });
          return schema.data;
        });
      }
    };
  }
  
  function addTimeInterceptor($q){
    return {
      'response': function(response){
        console.log('response interceptor added timestamp: ', response);
        // check if not modifying all response, only what we need:
        if(response.headers()['content-type'] === "application/json; charset=utf-8"){
          response.data.forEach(function(schemaModel){
            if(schemaModel.hasOwnProperty('timestamp')){
              schemaModel.timestamp = new Date().getTime();
            }
          });
        }
        return response;
      }
    };
  }
})();