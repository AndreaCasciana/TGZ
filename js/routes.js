angular.module("myApp").config(function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: 'html/template/home.html'
    }).when('/login', {
        templateUrl: 'html/template/login.html'
    }).when('/verify', {
        templateUrl: 'html/verification.html'
    }).when('/registration-successful', {
        templateUrl: 'html/registration_success.html'
    }).when('/not-verified', {
        templateUrl: 'html/not_verified.html'
    }).when('/reset', {
        templateUrl: 'html/reset_password.html'
    });
});