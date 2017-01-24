var app = angular.module('profileApp',[]);
app.controller('profileController',function($scope,$http){
    $scope.sendAddFriend = function ($me,$friend) {
        $http.post("/send-add-friend/"+$me+'/'+$friend)
            .success(function(){
                $scope.msg="send add friend success";
              //  $scope.displayStud();
            }).error(function(){
            $scope.msg = "error";
        });
    }
});