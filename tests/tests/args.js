define(['_.mixins'], function(undef) {

return function() {

	module('_.args(arguments, ini, end)');


	test('arguments only', function() {
		var original = ['first','second','third','fourth'],
			clone = _.clone(original);

		function transform_all_arguments_into_array() {
			var args = _.args(arguments);

			return args;
		}


		deepEqual(transform_all_arguments_into_array.apply(null, original), clone);
	});

	test('arguments begining at ... ini', function() {
		var original = ['first','second','third','fourth'];

		function transform_arguments_after_the_second_into_array() {
			var args = _.args(arguments, 2);

			return args;
		}


		deepEqual(transform_arguments_after_the_second_into_array.apply(null, original), ['third','fourth']);
	});

	test('arguments begining at ... and ending at ... (ini-end)', function() {
		var original = ['first','second','third','fourth'];

		function transform_arguments_2_and_3_into_array() {
			var args = _.args(arguments, 1, 3);

			return args;
		}

		deepEqual(transform_arguments_2_and_3_into_array.apply(null, original), ['second','third']);
	});
}
});