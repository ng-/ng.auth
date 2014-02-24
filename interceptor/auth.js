// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------

//Auth interceptors borrows outh2's concept of a "bearer" access token that is enough to validate a request in and of itself.
//This, however, is only secure over https.  Without https we would need to use this token to sign each and every request as
//oauth1 and/or amazon web services do for their api. This however would require a client side crypto library which is heavier
//than the simple authentication that this module intends to provide.

exports.client = function(data, $location, $q)
{
	return {

		request: function(config)
		{
			if ('/rpc/' == config.url.slice(0, 5) && 'login' != config.url.slice(5, 10))
			{
				var login = data('login')

				if (login)
				{
					config.url += '&id='+login.id+'&key='+login.key
				}
				else
				{
					$location.path('login')
				}
			}

			return config
		},

		responseError:function(res)
		{
			if (401 != res.status)
			{
				return res
			}

			$location.path('login')

			return $q.reject(res)
		}
	}
}

exports.server = function(data, $q)
{
	var url = require('url')

	return {

		request:function(config)
		{
			if ('/rpc/' == config.url.slice(0, 5) && 'login' != config.url.slice(5, 10))
			{

				var parse = url.parse(config.url, true)
				  , sess  = data(parse.query.id)

				console.log('Accessing key under id', parse.query.id)

				//console.log('SECONDS PASSED', Date.now() - url.query.now)

				if ( ! sess)
				{
					return $q.reject({status:401, data:'Session does not exist for '+parse.query.id})
				}

				if (parse.query.key != sess.key)
				{
					return $q.reject({status:401, data:'HMAC doesn\'t match'+parse.query.key})
				}

				delete parse.search
				delete parse.query.id
				delete parse.query.key

				config.url = url.format(parse)
			}

			return config
		}
	}
}