'use strict'

module.exports = function($scope, $routeParams, login, alert, $location)
{
	$scope.welcome = 'Simply delete the ng.crud folder once it is no longer helpful as a reference'

	$scope.user = {email: $routeParams.email}

	$scope.signIn = function(user)
	{
		login(user.email, user.password).then(function(key)
		{
			alert.success('You just logged in! Enter items in your donation by clicking on the "Next Item" button above', true)
			//alert.success('You just logged in!')

			$location.path('label')
		})
	}
}