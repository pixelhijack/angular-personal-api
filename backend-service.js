'use strict';
(function(){
  angular.module('app.services.backend', ['firebase'])
         .factory('Backend', Backend);
         
    function Backend($q){
      var firebase = new Firebase("https://sweltering-inferno-8689.firebaseio.com/"),
          apibase = firebase.child("/personalapi"),
          endpoint = firebase.child("/");
         
      return {
        api: function(apiendpoint){
          endpoint = apibase.child(apiendpoint);
          return this;
        }, 
        add: function(entry, callback){
          if(entry.hasOwnProperty('$$hashKey')){
            delete entry.$$hashKey;
          }
          endpoint.push(entry, function(){
            if(callback){ callback(); }
          });
        }, 
        update: function(){},
        overwrite: function(entry, successCallback, errorCallbck){
          endpoint.set(entry, function(error){
            if(error){
              if(errorCallbck){ errorCallbck(); }
            }else{
              if(successCallback){ successCallback(); }
            };
          });
        },
        read: function(callback){
          endpoint.on('value', function(snapshot){
            callback(snapshot.val());
          });
        }, 
        login: function(user, pass){
          var deferred = $q.defer();
          firebase.authWithPassword({
            email    : user,
            password : pass 
          }, function(error, authData) {
            if(error === null) {
              console.log("Authenticated", authData);
              deferred.resolve(authData);
            }else{
              console.log("Error authenticating user:", error);
              deferred.reject(error);
            }
          });
          return deferred.promise;
        },
        logout: function(){
          firebase.unauth();
        },
        isValid: function(entry, callback){
          for(var prop in entry){
            if(entry[prop] == null){
              return false;
            }
          }
          return true;
        },
        clear: function(successCallback, errorCallbck){
          endpoint.set({}, function(error){
            if(error){
              if(errorCallbck){ errorCallbck(); }
            }else{
              if(successCallback){ successCallback(); }
            };
          });
        },
      };
    }
})();