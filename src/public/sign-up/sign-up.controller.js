(function () {
"use strict";

angular.module('public')
.controller('SignUpController', SignUpController);

SignUpController.$inject = ['SignUpService', 'MenuService'];
function SignUpController(SignUpService, MenuService) {
  var signUpCtrl = this;
  signUpCtrl.msgSave = false;
  signUpCtrl.dishExist = true;

  signUpCtrl.submit = function(){
    SignUpService.postUserMsg(signUpCtrl.user);
    signUpCtrl.msgSave = true;
    if (signUpCtrl.user){
      MenuService.getUserDish(signUpCtrl.user.dish)
      .then(function(result) {
        signUpCtrl.dishInfo = result;
      })
      .catch(function(err) {
        signUpCtrl.dishExist = false;
        console.log(signUpCtrl.dishExist);
      })
    };
  };

}


})();
