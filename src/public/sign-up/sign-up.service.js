(function () {
"use strict";

angular.module('public')
.service('SignUpService', SignUpService);

SignUpService.$inject = ['$http'];
function SignUpService($http) {
  var service = this;
  var userMsg = [];

  service.postUserMsg = function (msg) {
      userMsg.push(msg);
      console.log(userMsg[userMsg.length - 1]);
  };

  service.getUserMsg = function () {
      return userMsg[userMsg.length - 1];
  }

  service.getLocalMsg = function () {
      return $http.get('src/public/sign-up/user.json').then(function(result){
        return result.data;
      })
  };

}



})();
