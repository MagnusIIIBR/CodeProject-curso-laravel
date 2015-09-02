var app = angular.module('app',['ngRoute', 'angular-oauth2', 'app.controllers', 'app.services']);
//var app = angular.module('app',['ngRoute', 'angular-oauth2', 'app.controllers', 'ngCookies']);

angular.module('app.controllers',['ngMessages', 'angular-oauth2']);

angular.module('app.services',['ngResource']);


// 31/08/2015 - Criando um Provider
app.provider('appConfig', function(){
	var config = {
		baseUrl: 'http://localhost:8000'
	};

	return {
		config: config,
		$get: function(){
			return config;
		}
	}
});

//app.config(['$routeProvider', 'OAuthProvider',function($routeProvider, OAuthProvider){
//app.config(['$routeProvider', 'OAuthProvider', 'OAuthTokenProvider',function($routeProvider, OAuthProvider, OAuthTokenProvider){
app.config([
	'$routeProvider', 'OAuthProvider', 'OAuthTokenProvider', 'appConfigProvider',
	function($routeProvider, OAuthProvider, OAuthTokenProvider, appConfigProvider){
	$routeProvider
		.when('/login',{
			templateUrl: 'build/views/login.html',
			controller: 'LoginController'
		})
		.when('/home',{
			templateUrl: 'build/views/home.html',
			controller: 'HomeController'
		})
		.when('/clients',{
			templateUrl: 'build/views/client/list.html',
			controller: 'ClientListController'
		})
		.when('/clients/new',{
			templateUrl: 'build/views/client/new.html',
			controller: 'ClientNewController'
		})
		.when('/clients/:id/edit',{
			templateUrl: 'build/views/client/edit.html',
			controller: 'ClientEditController'
		})
		.when('/clients/:id/remove',{
			templateUrl: 'build/views/client/remove.html',
			controller: 'ClientRemoveController'
		});

	OAuthProvider.configure({
		//baseUrl: 'http://localhost:8000',
		baseUrl: appConfigProvider.config.baseUrl,
		clientId: 'appid1',
		clientSecret: 'secret', // optional
		grantPath: 'oauth/access_token' // URL para pegar o Token
	});

	OAuthTokenProvider.configure({
      name: 'token',
      options: {
        secure: false
      }
    });
}]);

// 27.08.2015 - Metodo para executar as funções após o angular ser carregado
app.run(['$rootScope', '$window', 'OAuth', function($rootScope, $window, OAuth) {
	// adicionando um evento
    $rootScope.$on('oauth:error', function(event, rejection) {
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' === rejection.data.error) {
        return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('invalid_token' === rejection.data.error) {
        return OAuth.getRefreshToken();
      }

      // Redirect to `/login` with the `error_reason`.
      return $window.location.href = '/login?error_reason=' + rejection.data.error;
    });
  }]);