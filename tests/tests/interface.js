define(['_.mixins'], function(undef) {

return function() {

	/////////////////////
	/// USING OBJECTS ///
	/////////////////////

	module('_.interface using object', {
		setup: function() {
			window.data = {
				str: 'string',
				obj: {
					obj_string: 'value1',
					obj_number: 2193102,
					obj_boolean: true,
				},
				bool: false,
				no: 3,
			};
		},
		teardown: function() {
			delete data;
		}
	});


	test('single: valid interface', function() {
		var valid = false;

		valid = _.interface(data, {
			id: 'valid1',
			typeofs: {
				str: 'string',
				obj: {
					obj_boolean: 'boolean',
					obj_number: 'number',
					obj_string: 'string',
				}
			}
		});

		equal(valid, 'valid1')

	});
	
	test('single: invalid interface.', function() {
		// first invalid interface
		var invalid1 = false;

		try {
			_.interface(data, {
				id: 'invalid1',
				typeofs: {
					str: 'object',
					obj: 'object',
					bool: 'boolean',
				}
			});
		} catch (exception) {
			invalid1 = true;
		}

		ok(invalid1);

		// second invalid interface
		var invalid2 = false;

		try {
			_.interface(data, {
				id: 'invalid2',
				typeofs: {
					str: 'string',
					obj: {
						obj_string: 'string',
						obj_number: 'number',
						obj_boolean: 'number',
					}
				}
			})
		} catch(exception) {
			invalid2 = true;
		}

		ok(invalid2);
	});

	test('multiple: first valid', function() {
		var valid = _.interface(data, [
			{
				id: 'first',
				typeofs: {
					str: 'string',
					obj: {
						obj_string: 'string',
						obj_number: 'number',
						obj_boolean: 'boolean',
					},
					bool: 'boolean',
					no: 'number',
				}
			},
			{
				id: 'second',
				typeofs: {
					str: 'object',
					obj: 'object',
					bool: 'string',
					no: 'number',
				}
			}
		]);


		equal(valid, 'first');
	});


	test('multiple: second valid', function() {
		var valid = _.interface(data, [
			{
				id: 'first',
				typeofs: {
					str: 'object',
					obj: 'object',
					bool: 'string',
					no: 'number',
				}
			},
			{
				id: 'second',
				typeofs: {
					str: 'string',
					obj: {
						obj_string: 'string',
						obj_number: 'number',
						obj_boolean: 'boolean',
					},
					bool: 'boolean',
					no: 'number',
				}
			},
		]);

		equal(valid, 'second')
	});

	test('multiple: third valid', function() {
		var valid = _.interface(data, [
			{
				id: 'first',
				typeofs: {
					str: 'object',
					obj: 'object',
					bool: 'string',
					no: 'number',
				}
			},
			{
				id: 'second',
				typeofs: {
					str: 'string',
					obj: 'boolean',
					bool: 'boolean',
					no: 'number',
				}
			},
			{
				id: 'third',
				typeofs: {
					str: 'string',
					obj: {
						obj_string: 'string',
						obj_number: 'number',
						obj_boolean: 'boolean',
					},
					bool: 'boolean',
					no: 'number',
				}
			},
		]);

		equal(valid, 'third')
	});



	//////////////////////////////
	/// USING ARGUMENTS OBJECT ///
	//////////////////////////////

	module('_.interface using arguments object');

	test('single: valid.', function() {
		var valid = false;

		function aaa() {

			valid = _.interface(arguments, {
				id: 'valid using arguments',
				typeofs: [
					'string',
					{
						obj_string: 'string',
						obj_boolean: 'boolean',
						obj_object: 'object',
					},
					'boolean',
					'number',
				]
			});
		}

		aaa(
			'kasjdkajds',
			{
				obj_string: 'sss',
				obj_boolean: false,
				obj_object: {}
			},
			true,
			120930123
		);

		ok(valid);

	});

	test('multiple: second.', function() {
		var valid = false;

		function aaa() {

			valid = _.interface(arguments, [
				{
					id: 'first',
					typeofs: [
						'string',
						{
							obj_string: 'string',
							obj_boolean: 'boolean',
							obj_object: 'object',
						},
						'boolean',
						'number',
					]
				},
				{
					id: 'second',
					typeofs: [
						'boolean',
						'object',
						'boolean',
						'number'
					]
				}
			]);
		}

		aaa(
			false,
			{
				obj_string: 'sss',
				obj_boolean: false,
				obj_object: {}
			},
			true,
			120930123
		);

		equal(valid, 'second')
	});

}
});