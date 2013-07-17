define(['_.mixins', 'eventemitter2'], function(undef, Eventemitter2) {

return function() {

	module('_.getset(data)', {
		setup: function() {
			window.control = {};
			window.obj = _.extend({}, Eventemitter2.prototype);

			obj.sideEffect = {};


			obj.state = function(name, state) {
				return _.getset({
					context: this,
					obj: 'states',
					name: name,
					value: state,
					iterator: function(name, state) {
						this.sideEffect[ name ] = state;

						return state;
					},
					options: {
						events: 'set-state',
						evaluate: true
					}

				})
			};

			// listen to ehte set-state events and log them on the control object
			obj.on('set-state', function(statename, states) {
				control[statename] = states[statename];
			});
		},
		teardown: function() {
			delete window.control;
			delete window.obj;
		}
	});
	/*
		data: {
			context: obj,
			obj: obj || string,
			name: string,
			value: whatever,
			iterator: function,
			options: {
				events: string || array || object || function,
				evaluate: boolean
			}
		}
	*/
	test('_.getset as single setter', function() {

		// create a test object
		var teststate = {
			aaa: 'bbb',
			ccc: function() {

			}
		}

		obj.state('test', teststate);

		// compare!
		deepEqual(obj.states.test, teststate, 'test setting correctly saved');
		deepEqual(control.test, teststate, 'event was correctly emitted');

		// check if sideEffects were correct
		deepEqual(obj.sideEffect, obj.states, 'side effects correct');



	});


	test('_.getset as multiple setter', function() {
		// create a test object
		var a = 'aaa',
			b = {
				oo: 'ss',
				eqweqwe: 'qweqweqwe qwe qwe qe'
			},
			c = function() {
				alert('111')
			};

		// set the states
		obj.state({ a: a, b: b, c: c });

		deepEqual(obj.states, {
			a: a, b: b, c: c
		}, 'settings correct');

		deepEqual(control, obj.states, 'events correctly fired');

		// check if sideEffects were correct
		deepEqual(obj.sideEffect, obj.states, 'side effects correct');



	});


	test('_.getset as inteligent getter', function() {
		// listen to ehte set-state events and log them on the control object
		obj.on('set-state', function(statename, states) {
			control[statename] = states[statename];
		});

		// create a test object
		var a = 'aaa',
			b = {
				oo: 'ss',
				eqweqwe: 'qweqweqwe qwe qwe qe'
			},
			c = function() {
				return 'bananas'
			};

		// set the states
		obj.state({ a: a, b: b, c: c });

		deepEqual(obj.state('a'), obj.states['a'], 'getting simple data correctly');
		deepEqual(obj.state('c'), obj.states['c'](), 'getting intelligent data correctly');

		// check if sideEffects were correct
		deepEqual(obj.sideEffect, obj.states, 'side effects correct');



	});


}
});