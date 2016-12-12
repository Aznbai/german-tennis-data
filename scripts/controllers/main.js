'use strict';
myApp.controller('appContentController', appContentController);
appContentController.$inject = ['$scope', '$rootScope', '$filter', '$http'];

function appContentController($scope, $rootScope, $filter, $http) {
  $scope.name = 'World';
  //get tennis data json file via request and set global variable AFTERWARDS
  $http.get("tennis.json").success(function(data) {
    $scope.tennisConfig = data;
    console.log("current tennis year:");
    console.log($scope.tennisConfig);
    //TENNIS WATCHER
    $scope.$watch(
      "this.tennisConfig.yearCurr",
      function handleYearChange(newValue, oldValue) {
        var currYearJunSenDonutData = $filter('filter')($scope.tennisConfig.tennisData, {
          year: $scope.tennisConfig.yearCurr
        })[0];
        var currYearCourtData = $filter('filter')($scope.tennisConfig.tennisData, {
          year: $scope.tennisConfig.yearCurr
        })[0];
        var currAtpDonutPartYearId = $scope.tennisConfig.atpSuperstarsData.year.indexOf(parseInt($scope.tennisConfig.yearCurr));
        var currWtaDonutPartYearId = $scope.tennisConfig.wtaSuperstarsData.year.indexOf(parseInt($scope.tennisConfig.yearCurr));
        var currCourtDonutPartYearId = $scope.tennisConfig.courtChartData.year.indexOf(parseInt($scope.tennisConfig.yearCurr));
        var currClubDonutPartYearId = $scope.tennisConfig.clubChartData.year.indexOf(parseInt($scope.tennisConfig.yearCurr));
        var currAtpYearDonutData = $scope.tennisConfig.atpSuperstarsData.stars[currAtpDonutPartYearId];
        var currWtaYearDonutData = $scope.tennisConfig.wtaSuperstarsData.stars[currWtaDonutPartYearId];
        var currCourtYearDonutData = $scope.tennisConfig.courtChartData.court[currCourtDonutPartYearId];
        var currClubYearDonutData = $scope.tennisConfig.clubChartData.club[currClubDonutPartYearId];
        console.log("CURRENT YEAR-ID IN ATP:", currAtpDonutPartYearId);
        console.log("CURRENT YEAR-ID IN WTA:", currWtaDonutPartYearId);
        console.log("CURRENT YEAR-ID IN COURTS:", currCourtDonutPartYearId);
        console.log("CURRENT YEAR-ID IN CLUBS:", currClubDonutPartYearId);
        console.log("CURRENT YEAR DATA IN ATP:", currAtpYearDonutData);
        console.log("CURRENT YEAR DATA IN WTA:", currWtaYearDonutData);
        console.log("CURRENT YEAR DATA IN COURTS:", currCourtYearDonutData);
        console.log("CURRENT YEAR DATA IN CLUBS:", currClubYearDonutData);
        var junSenOneP = ($scope.tennisConfig.stateCurr.junior + $scope.tennisConfig.stateCurr.senior) / 100; //one percent
        var juniorP = Math.round($scope.tennisConfig.stateCurr.junior / junSenOneP * 100) / 100; //junior percentage rounded by 2 decimals
        var seniorP = Math.round($scope.tennisConfig.stateCurr.senior / junSenOneP * 100) / 100; //senoir percentage rounded by 2 decimals
        var atpWtaOneP = (currAtpYearDonutData + currWtaYearDonutData) / 100; //one percent
        var atpP = Math.round(currAtpYearDonutData / atpWtaOneP * 100) / 100; //junior percentage rounded by 2 decimals
        var wtaP = Math.round(currWtaYearDonutData / atpWtaOneP * 100) / 100; //senoir percentage rounded by 2 decimals
        var courtClubOneP = (currCourtYearDonutData + currClubYearDonutData) / 100; //one percent
        var courtP = Math.round(currCourtYearDonutData / courtClubOneP * 100) / 100; //junior percentage rounded by 2 decimals
        var clubP = Math.round(currClubYearDonutData / courtClubOneP * 100) / 100; //senoir percentage rounded by 2 decimals
        $scope.tennisConfig.stateCurr.junSenDonutParts = [currYearJunSenDonutData.junior, currYearJunSenDonutData.senior];
        $scope.tennisConfig.stateCurr.atpWtaDonutParts = [nanToZero(currAtpYearDonutData), nanToZero(currWtaYearDonutData)];
        $scope.tennisConfig.stateCurr.courtClubDonutParts = [nanToZero(currCourtYearDonutData), nanToZero(currClubYearDonutData)];
        // console.log($scope.tennisConfig.stateCurr.junSenDonutParts);
        // console.log($scope.tennisConfig.stateCurr.atpWtaDonutParts); 
        // $scope.tennisConfig.stateCurr.wta = currYearJunSenDonutData.junior;
        // $scope.tennisConfig.stateCurr.junior = currYearJunSenDonutData.junior;
        // $scope.tennisConfig.stateCurr.senior = currYearJunSenDonutData.senior;
        $scope.tennisConfig.junSenNamesCurr[0] = "junioren: " + juniorP + "%";
        $scope.tennisConfig.junSenNamesCurr[1] = "senioren: " + seniorP + "%";
        $scope.tennisConfig.atpWtaNamesCurr[0] = "Atp: " + atpP + "%";
        $scope.tennisConfig.atpWtaNamesCurr[1] = "Wta: " + wtaP + "%";
        $scope.tennisConfig.courtClubNamesCurr[0] = "Courts: " + courtP + "%";
        $scope.tennisConfig.courtClubNamesCurr[1] = "Clubs: " + clubP + "%";
        $scope.tennisConfig.bipCurr = currYearJunSenDonutData.bip;
      }
    );
  });
  //  propagate config changes for refresh
  $scope.configChange = function() {
    $rootScope.$broadcast("configChange");
  };

  function nanToZero(argument) {
    if (isNaN(argument)) {
      argument = 1;
    }
    return argument;
  }
}