//Serverside localStorage using JSON arrays (maybe put this in ng core)
//this is outside of the exports so it will still allow this function
//to go onto the client as well.

var sessionStorage = {}
  , localStorage

try
{
	localStorage = require('../storage.json')
}
catch (e)
{
	localStorage = {}
}

function saveFile(storage)
{
	require('fs').writeFile(__dirname+'/../storage.json', JSON.stringify(storage, null, '   '))
}

module.exports = function($rootScope)
{
	var flashStorage   = {}
	  , nextStorage    = {}

	$rootScope.$on('$routeChangeStart', function()
	{
		flashStorage = nextStorage; nextStorage = {}
	})

	return function(key, value, persist)
	{
		var current  = angular.fromJson(flashStorage[key] || sessionStorage[key] || localStorage[key])

		if (1 == arguments.length)
		{
			return current
		}

		var storage = sessionStorage

		if (false === persist)
		{
			storage = nextStorage
		}

		if (true === persist)
		{
			storage = localStorage
		}

		// If both are arrays concatenate rather than replace avoiding needlessly complicated code:
		// var alerts = data.sess('alerts); alerts.push({new:alert}); data.sess('alerts', alerts)
		// instead we can do this all in one command with data.sess('alerts[]', {new:alert})
		if (key.slice && '[]' == key.slice(-2))
		{
			key = key.slice(0, -2)

			current.push(value)

			value = current
		}

		storage[key] = angular.toJson(value)

		persist && angular.isDefined(saveFile) && saveFile(storage)

		return value
	}
}