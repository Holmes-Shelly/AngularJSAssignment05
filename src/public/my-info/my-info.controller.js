(function () {
"use strict";

angular.module('public')
.controller('MyInfoController', MyInfoController);

MyInfoController.$inject = ['SignUpService', 'MenuService'];
function MyInfoController(SignUpService, MenuService) {
  var myInfoCtrl = this;
  myInfoCtrl.dishExist = true;
  myInfoCtrl.myInfo = SignUpService.getUserMsg();
  if (myInfoCtrl.myInfo){
    MenuService.getUserDish(myInfoCtrl.myInfo.dish)
    .then(function(result){
      myInfoCtrl.dishInfo = result;
      console.log(myInfoCtrl.dishInfo);
    })
    .catch(function(err) {
      myInfoCtrl.dishExist = false;
      console.log(myInfoCtrl.dishExist);
    })
  }
  /*
  SignUpService.getLocalMsg()
  .then(function(result){
    myInfoCtrl.myInfo = result;
    console.log(myInfoCtrl.myInfo);
  });

  */
  }


})();
