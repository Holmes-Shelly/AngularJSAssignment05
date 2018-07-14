(function () {
"use strict";

angular.module('public')
.controller('SignUpController', SignUpController);

SignUpController.$inject = ['MenuService'];
function SignUpController(MenuService) {
  var signUp = this;
  signUp.submit = function () {
    signUp.completed = true;
  };
  signUp.checkDish = function () {
    if (MenuService.getUserDish(signUp.dish).status != "500"){
      signUp.exists = true;
      console.log(MenuService.getUserDish(signUp.dish));
    }
    else {
      signUp.exists = false;
    };
  };
}

})();
