'use strict';
(function(){
  angular.module('app.directives', [])
      .directive('dateInput', dateInput);

  function dateInput(dateFilter){
    return {
        require: 'ngModel',
        template: '<input type="date"></input>',
        replace: true,
        link: function(scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return dateFilter(modelValue, 'yyyy-MM-dd');
            });
            
            ngModelCtrl.$parsers.unshift(function(viewValue) {
                return new Date(viewValue);
            });
        }
    };
  }

})();