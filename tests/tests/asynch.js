define(['_.mixins'], function(undef) {

return function() {
	module('asynch');

	asyncTest('tasks as arguments', function() {

		var commonData = {bananas: 'bananas'},
			started = {};

		// first
		// this task does not call next, but returns a promise
		function first(next, common) {
			var defer = $.Deferred();

			// first started at:
			started.first = new Date();

			// check if common is equal to the original common
			deepEqual(common, commonData, 'common correctly passed to first')

			// set a value on common
			common.first = 'apple';

			setTimeout(defer.resolve, 500);

			return defer;
		}

		// second task
		function second(next, common) {

			// second started at
			started.second = new Date();

			// check if common is equal commonData + first
			deepEqual(common, _.extend({},commonData,{ first: 'apple'}) );

			common.second = 'pineapple';

			setTimeout(next, 300);
		}

		// third task 
		function third(next, common) {
			// third started at
			started.third = new Date();

			// check if common is equal commonData + first
			deepEqual(common, _.extend({},commonData,{ first: 'apple', second: 'pineapple'}) );

			common.third = 'blueberry';

			setTimeout(function() {
				next(common);
			}, 100);
		}

		var asynch = _.asynch({common: commonData}, first, second, third);


		asynch.then(function(common) {
			// do checking

			// now - third
			var now_third = new Date() - started.third;
			ok(now_third >= 100 && now_third <= 110);

			// second - first
			var second_first = started.second - started.first;
			ok(second_first >= 500 && second_first <= 510);

			// third - second
			var third_second = started.third - started.second;
			ok(third_second >= 300 && third_second <= 310);


			// check common
			deepEqual(common, {
				bananas: 'bananas',
				first: 'apple',
				second: 'pineapple',
				third: 'blueberry'
			}, 'common correctly set throughout the sequence')


			start();
		});


	});


	module('asynch: error handling');

	asyncTest('first fails', function() {

	});


	module('asynch: task map');

	asyncTest('task map', function() {

		// control objects
		var before = {},
			after = {},
			started = {};

		// common values
		var delays = {
			first: 400,
			second: 200,
			third: 300
		};

		function first(next, common) {
			started.first = new Date();
			setTimeout(next, delays.first);
		}

		function second(next, common) {
			started.second = new Date();
			setTimeout(next, delays.second);
		}

		function third(next, common) {
			started.third = new Date();
			setTimeout(next, delays.third);
		}


		var asynch = _.asynch({
				map: ['first','second','third'],
				before: function(taskname) {
					before[ taskname ] = new Date();

					console.log('before',taskname, new Date());
				},
				after: function(taskname) {
					after[ taskname ] = new Date();

					console.log('after',taskname, new Date());
				},

				tasks: [first, second, third]
			});


		asynch.then(function() {
			// do checkings!

			var started_minus_before = _.mapo(started, function(stt, taskname) {
					return stt - before[ taskname ];
				}),
				after_minus_started = _.mapo(after, function(aft, taskname) {
					return aft - started[ taskname ];
				});

			// task started always after the before method was called
			ok(started_minus_before.first > 0 && started_minus_before.second > 0 && started_minus_before.third > 0, 'task started always after the before method was called');

			// after started always after the task started
			ok(after_minus_started.first > 0 && after_minus_started.second > 0 && after_minus_started.third > 0, 'after method starts after task has started');

			// restart the unit test normal flow.
			start();
		});
	});
}
});