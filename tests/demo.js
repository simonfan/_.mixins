define(['_.mixins'], function(undef) {


	window.data = {
		no: 1,
		obj: {},
		str: 'string',
	}

	_.interface({
		id: 'Demo interface',
		obj: data,
		typeofs: {
			no: 'number',
			obj: 'object',
			str: 'string',
			str_or_undef: ['undefined', 'string']
		}
	});



	window._argsTest = function() {
		console.log( _.isArray(arguments), 'arguments is not an array' );


		var args = _.args(arguments);

		console.log( _.isArray(args), '_.args(arguments) returns an array');
		return args;
	};

	_argsTest('aaasd', 8918932, {adqwe: 10});
});