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
					options: {
						iterate: function(name, state) {
							this.sideEffect[ name ] = state;

							return state;
						},
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
			iterate: function,
			options: {
				events: string || array || object || function,
				evaluate: boolean || function
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

	module('_.getset(data) [2]');


	test('_.getset(data), using function evaluate', function() {
		var control = {},
			obj = _.extend({}, Eventemitter2.prototype);

		obj.sideEffect = {};


		obj.state = function(name, state) {
			return _.getset({
				context: this,
				obj: 'states',
				name: name,
				value: state,
				options: {
					events: 'set-state',
					iterate: function(name, state) {
						this.sideEffect[ name ] = state;

						return state;
					},
					evaluate: function(name, state) {
						return state['eval_value'];
					}
				}

			})
		};

		// listen to ehte set-state events and log them on the control object
		obj.on('set-state', function(statename, states) {
			control[statename] = states[statename];
		});

		// create a test object
		var a = {
				eval_value: 'effective val',
				not_eval: 'lalala'
			},
			b = {
				oo: 'ss',
				eqweqwe: 'qweqweqwe qwe qwe qe'
			},
			c = function() {
				return 'bananas'
			};

		// set the states
		obj.state({ a: a, b: b, c: c });


		// check the value returned by get
		equal(obj.state('a'), a.eval_value, 'value correctly evaluated');
		equal(obj.state('b'), undefined);
	});


	test('using array of objects to get from', function() {
		var obj = {};

		/// a list of objects
		obj.prioritaire = {
			banana: 'banana',
			apple: 'apple',
		};

		obj.secondpriority = {
			pineapple: 'pineapple',
		};

		obj.thirdpriority = {
			watermelon: 'watermelon',
		};


		obj.value = function(name, value) {
			return _.getset({
				context: this,
				obj: ['prioritaire','secondpriority','thirdpriority'],
				name: name,
				value: value,
				options: {}
			});
		};



		equal(obj.value('banana'), obj.prioritaire.banana, 'got from prioritaire');
		equal(obj.value('watermelon'), obj.thirdpriority.watermelon, 'got data from thirdpriority');
		equal(obj.value('pineapple'), obj.secondpriority.pineapple, 'got data from secondpriority');


		// set a watermelon value on the object
		// expect the next time watermelon is required, the prioritaire value to be returned
		obj.value('watermelon', 'prioritaire watermelon');

		equal(obj.value('watermelon'), 'prioritaire watermelon', 'value correctly overwritten');


		// delete the watermelon value on prioritaire
		// expect things to fall back to the original configuration
		delete obj.prioritaire.watermelon;
		equal(obj.value('watermelon'), obj.thirdpriority.watermelon, 'data back to original');

	});


	test('setting a default value through evaluate option', function() {
		var obj = {};

		/// a list of objects
		obj.prioritaire = {
			banana: 'banana',
			apple: 'apple',
		};

		obj.secondpriority = {
			pineapple: 'pineapple',
		};

		obj.thirdpriority = {
			watermelon: 'watermelon',
		};


		obj.value = function(name, value) {
			return _.getset({
				context: this,
				obj: ['prioritaire','secondpriority','thirdpriority'],
				name: name,
				value: value,
				options: {
					evaluate: function(name, value) {
						return (typeof value === 'undefined') ? 'default value' : value;
					}
				}
			});
		};


		equal(obj.value('not_real'), 'default value', 'default correctly set')
	});




	test('using a function in the name field', function() {
		var obj = {};

		/// a list of objects
		var obj1 = {
				id: 'obj1',
				apple: 'apple',
			},
			obj2 = {
				id: 'obj2',
				pineapple: 'pineapple',
			};


		obj.obj = function(object) {

			var name, value;

			if (typeof object === 'object') {
				// set!
				name = object.id;
				value = object;

			} else if (typeof object === 'string') {
				// get!
				name = object;
			}

			return _.getset({
				context: this,
				obj: ['prioritaire','secondpriority','thirdpriority'],
				name: name,
				value: value,
			});
		};


		// set obj1 and obj2;
		obj.obj(obj1);
		obj.obj(obj2);

		// check!
		deepEqual(obj.obj('obj2'), obj2, 'second obj correctly set');
		deepEqual(obj.obj('obj1'), obj1, 'first obj correctly set');
	});




	test('no arguments, just get the object', function() {
		var obj = {};

		/// a list of objects
		obj.prioritaire = { banana: 'banana' };


		obj.obj = function(name, value) {
			return _.getset({
				context: this,
				obj: ['prioritaire','secondpriority','thirdpriority'],
				name: name,
				value: value,
			});
		};

		deepEqual(obj.prioritaire, obj.obj());
	});



}
});