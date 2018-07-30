var mainOptions = {
    templateUrl: 'partials/main.html',
    controller: 'NowCtrl',
    controllerAs: 'nc'
};
var buyOptions = {
    templateUrl: 'partials/byfoot/buy.html',
    controller: 'BuyCtrl',
    controllerAs: 'bc'

};
var taxiOptions = {
    templateUrl: 'partials/byfoot/taxi.html',
    controller: 'TaxiCtrl',
    controllerAs: 'tc'

};
var eatOptions = {
    templateUrl: 'partials/byfoot/eat.html',
    controller: 'EatCtrl',
    controllerAs: 'ec'

};
var routeProvider = function($routeProvider) {
    $routeProvider.when('/', mainOptions)
        .when('/buy', buyOptions)
        .when('/taxi', taxiOptions)
        .when('/eat', eatOptions)
        .otherwise({
            redirectTo: '/'
        });
};
angular.module('nowApp', ['ngRoute', 'onsen'])
    .config(['$routeProvider', routeProvider]);