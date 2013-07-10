define(['_.mixins'], function(undef) {


	window.data = {
		no: 1,
		obj: {},
		str: 'string',
	}

	_.interface(data, {
		id: 'Demo interface',
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










/*	window.root = {
		fruits: {
			yellow: {
				bananas: 'bananas',
				pineaples: 'pineaples',
			},
			red: {
				apples: 'apples'
			},
			green: {
				watermelons: 'watermelons',
			}
		},
		vegetables: {
			green: {
				lettuce: 'lettuce',
			},
			yellow: {
				potato: 'potato',
			}
		}
	}
*/

	window.branch_tomato = ['vegetables','red','tomato'];
	window.branch_melon = ['fruits','yellow','melon'];
	window.branch_meat = ['meats','red','beef']; 
});