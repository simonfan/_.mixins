define(['_.mixins'], function(undef) {

return function() {
	module('mapo');

	test('basic usage', function() {
		var original = {
				key1: 'key1',
				key2: 'key2'
			},
			controlOriginal = _.clone(original),
			mapped = _.mapo(original, function(value, key) {
				return value + '-altered';
			});


		deepEqual(original, controlOriginal, 'original remains unaltered');

		deepEqual(mapped, {
			key1: 'key1-altered',
			key2: 'key2-altered'
		}, 'mapped successfully');
	});
}
});