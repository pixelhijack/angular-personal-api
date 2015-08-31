'use strict';
(function(){
  angular.module('app.services.auth', [])
         .factory('Auth', Auth);
         
    function Auth($q){
      var user = $q.defer();
      return {
        fakeUser: function(){
          return user.resolve({
            email: "pxhj@gmail.com",
            uid: "simplelogin:1",
            expires: 1914767522,
            provider: "password",
            token: "asdfasdfasdf"
          }); 
        },
        setUser: function(userAuthenticated){
          sessionStorage.user = JSON.stringify(userAuthenticated);
          user.resolve(userAuthenticated);
        },
        getUser: function(){
          return sessionStorage.user;
        },
        isLoggedIn: function(){
          return user.promise;
        }, 
        logOut: function(){
          sessionStorage.clear();
        } 
      };
    }
})();