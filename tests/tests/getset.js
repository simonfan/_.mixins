define(['_.mixins', 'eventemitter2'], function(undef, Eventemitter2) {

return function() {

	module('_.getset(data)');
	/*
		data: {
			context: obj,
			root: obj || string,
			name: string,
			value: whatever,
			options: {
				events: string || array || object || function,
				evaluate: boolean
			}
		}
	*/
	test('_.getset as single setter', function() {
		var control = {},
			obj = _.extend({}, Eventemitter2.prototype);


		obj.state = function(name, state) {
			return _.getset({
				context: this,
				root: 'states',
				name: name,
				value: state,
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




	});


	test('_.getset as multiple setter', function() {
		var control = {},
			obj = _.extend({}, Eventemitter2.prototype);


		obj.state = function(name, state) {
			return _.getset({
				context: this,
				root: 'states',
				name: name,
				value: state,
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

		deepEqual(control, obj.states, 'events correctly fired')


	});


}
});