exports.client = function(data, $rpc)
{
	return function(id, password)
	{
		return $rpc('login', 0, 'trigger')(id, password).then(function(key)
		{
			if ( ! key)
			{
				return false
			}

			data('login', {id:id, key:key})

			return true
		})
	}
}

exports.server = function(data)
{
	return function(id, password)
	{
		for (var i = 0; i < 20; i++)
		{
			data(i, {Public:'public'+Math.floor(Math.random()*100), Secret:'secret'+Math.floor(Math.random()*100)}, true)
		}

		var now  = Date.now().toString()
		  , key  = require('crypto').createHmac('sha256', now).update(password).digest('hex')

		console.log('Saving key under id', id)
		data(id, {now:now, key:key})

		return key
	}
}
