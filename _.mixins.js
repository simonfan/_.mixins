define(['underscore','jquery'], function(undef, $) {

	//////// INTERFACE /////////

	function _interface(id, obj, typeofs, missing) {
		// an array to hold the not present expected values
		// this array mightbe passed in, as this function is intended to be called recursively.
		var missing = missing || [];

		_.each(typeofs, function(expected_type, prop_name) {
			if ( _.isArray(expected_type) ) {		// multiple types accepted
				var actual_type = typeof obj[ prop_name ];

				if ( _.indexOf(expected_type, actual_type) === -1 ) {
					// not present
					missing.push({
						id: id,
						prop_name: prop_name,
						expected_type: expected_type,
						actual_type: actual_type,
					});
				}

			} else if ( typeof expected_type === 'object' ) {
				// go recursive
				_interface(id + '-' + prop_name, obj[ prop_name ], expected_type, missing);

			} else {

				var actual_type = typeof obj[ prop_name ];

				if (actual_type === 'undefined' || actual_type != expected_type) {
					missing.push({
						id: id,
						prop_name: prop_name,
						prop_value: obj[ prop_name ],
						expected_type: expected_type,
						actual_type: actual_type,
					})
				}

			}
		});

		// after all typeofs were checked, if there is any missing property
		if (missing.length > 0) {
			return { id: id, implemented: false, missing: missing };
		} else {
			return { id: id, implemented: true };
		}
	}

	_.mixin({
		interface: function(obj, interfaces, _implemented, _missing) {
			// d: identifier, auxiliary, obj, typeofs
			/*

				typeofs:
					prop: typeof prop (str)
			*/
			var _implemented = _implemented || [],
				_missing = _missing || [];
			

			if ( _.isArray(interfaces) ) {
				// multiple interfaces
				// go recursive

				_.each(interfaces, function(interf, index) {
					var interf_status = _interface(interf.id, obj, interf.typeofs);

					if (interf_status.implemented) {
						_implemented.push(interf_status.id);
					} else {
						_missing = _missing.concat(interf_status.missing);
					}
				});

			} else {
				// only one interface
				var interf_status = _interface(interfaces.id, obj, interfaces.typeofs);

				if (interf_status.implemented) {
					_implemented.push(interf_status.id);
				} else {
					_missing = _missing.concat(interf_status.missing);
				}
			}


			if (_implemented.length === 0) {
				// throw errors
				_.each( _missing, function(missing, index) {
					var msg = 'Interface '+ missing.id +'\'s property '+ missing.prop_name +': expected = '+ missing.expected_type + ' | actual = '+ missing.actual_type;
					console.log(missing.prop_value);
					throw new Error(msg);
				});

			} else {
				return _implemented[0];
			}
			
		},
	});
	//////// INTERFACE /////////


	//////// ARGS /////////
	_.mixin({
		args: function(args, ini, end) {
			ini = ini || 0;
			return Array.prototype.slice.call(args, ini, end);
		}
	});


	/////////////////////
	//// TREE! //////////
	/////////////////////
	// convert an array into a object tree.
	// builds a branch on the provided object
	function _growBranch(branch, steps, leaf) {

		_.each(steps, function(step, index) {
			// if the step is the last one, then its value should be the leaf value.
			var v = (index === steps.length - 1) ? leaf : {};

			branch = branch[ step ] = v;
		});
	}

	_.mixin({

		branch: function(root, steps, leaf) {
			// check if the root object already has a property 
			// with the name equal to the first member of the branch
			var name = steps[0];

			if (typeof root[ name ] === 'undefined') {
				// branch does not exist!
				// define it and grow it!
				root[ name ] = {};
				_growBranch(root[ name ], steps.slice(1), leaf);

			} else if (typeof root[ name ] === 'object') {
				// branch exists and is an object.
				// go recursive
				if (steps.length === 0) {
					root[ name ][ steps[0] ] = leaf;
				} else {
					_.branch(root[ name ], steps.slice(1), leaf);
				}
			}

			return root;
		}
	});
	// branch //



	//////////////////////
	///// _.deep.js //////
	//////////////////////
	// https://gist.github.com/furf/3208381#file__.deep.js
	// provided by github/furf (https://github.com/furf);
	// Usage:
	//
	// var obj = {
	//   a: {
	//     b: {
	//       c: {
	//         d: ['e', 'f', 'g']
	//       }
	//     }
	//   }
	// };
	//
	// Get deep value
	// _.deep(obj, 'a.b.c.d[2]'); // 'g'
	//
	// Set deep value
	// _.deep(obj, 'a.b.c.d[2]', 'george');
	//
	// _.deep(obj, 'a.b.c.d[2]'); // 'george'
	_.mixin({

		// Get/set the value of a nested property
		deep: function (obj, key, value) {

			var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'),
				root,
				i = 0,
				n = keys.length;

			// Set deep value
			if (arguments.length > 2) {

				root = obj;
				n--;

				while (i < n) {
					key = keys[i++];
					obj = obj[key] = _.isObject(obj[key]) ? obj[key] : {};
				}

				obj[keys[i]] = value;

				value = root;

			// Get deep value
			} else {
				while ((obj = obj[keys[i++]]) != null && i < n) {};
				value = i < n ? void 0 : obj;
			}

			return value;
		}

	});




	////////////////////////////
	//////// getset ////////////
	////////////////////////////
	var gs = {};

	gs.emit = function(context, events, propname, obj) {
		// determine the emitting method
		var emit = typeof context.emit === 'function' ? context.emit : typeof context.trigger === 'function' ? context.trigger : false;

		if (!emit) {
			console.log('Hey, I\'m from _.mixins, _.getset, you told me to emit some events when a value was set.. I won\'t throw an Error, but I should, as you have not provided me .trigger or .emit methods!!')
			return context;
		}

		// if there is an emit method, check on the events type
		if (_.isArray(events)) {
			var args = _.args(arguments, 2);
				// remove the original events argument passed to emit.
			_.each(events, function(evt, index) {
				var emitargs = _.clone(args);

				// add the evt to the arguments list
				emitargs.unshift(evt);

				// emit
				emit.apply(context, emitargs);
			});

		} else if (typeof events === 'object') {
			// the events object is a hash of arguments keyed by events name
			// events is an object
			var args = _.args(arguments, 2)
			_.each(events, function(args, evt) {
				var emitargs = _.clone(args);

				// add the evt to the arguments list
				emitargs.unshift(evt);

				// emit
				emit.apply(_this, emitargs);
			});

		} else if (typeof events === 'function') {
			// the events objec it a function. Call it within this context and pass
			// in the obj object. Then re-call the emit event with the results
			var evts = events.call(this, obj);
			gs.emit(context, evts, propname, obj);

		} else {
			// the events is a string, so use the arguments passed after the events
			// name as emitting arguments
			// events is string
			var args = _.args(arguments, 1);

			// emit
			emit.apply(context, args);
		}

		return context;
	};

	gs.set = function(context, obj, name, value, options) {

		///////////
		/// 1: get the object on which the property should be set
		///////////

		// if obj is an array, just get the first object from the array
		// otherwise, keep it as it is.
		obj = _.isArray(obj) ? obj[0] : obj;

		// now that the obj is definetely not an array,
		// if it is a string, it is a namespace.
		if (typeof obj === 'string') {
			// obj is a namespace. Get the object or create it on the context object
			// prevent obj from being non-object
			// if there is no obj, create the object on the context
			context[obj] = obj = context[obj] || {};
		}

		// if object is already set and the noOverwrite option is set to true,
		// return without setting
		if (typeof obj[ name ] !== 'undefined' && options.noOverwrite) {
			return this;

		} else {
			// only set if the new value is different from the old value
			if (obj[ name ] !== value) {
				// set
				obj[ name ] = value;

				// if there should be emitted any kind of events..
				if (options.events) {
					gs.emit(context, options.events, name, obj);
				}
			}

			return this;
		}
	};

	gs.get = function(context, obj, name, options) {
		

		///////////////////
		//// 1: get a list of possible property owners
		////	property owners are objects that may contain the required property
		///////////////////

		// if obj is an array, leave it be as it is
		// if it is not an array, transform it into a single element array
		// just to fit in the _.find function
		var objects = _.isArray(obj) ? obj : [obj];

		// map the objects 
		objects = _.map(objects, function(obj, index) {
			return typeof obj === 'string' ? context[ obj ] || {} : obj; 
		});

		//////////////////
		//// 2: find the property owner
		//////////////////
		// find the first object that has the key
		var owner = _.find(objects, function(object, index) {
				return typeof object[ name ] !== 'undefined';
			}),
			value = typeof owner === 'object' ? owner[ name ] : undefined;

		////////////////
		/// 3: evaluate results
		////////////////
		/// OBS: any implementation of default value should be made here:
		///      just define a function evaluation that returns the default value if the
		///      value given is undefined.

		// check if there is an evaluation to be made
		if (options.evaluate) {

			if (typeof options.evaluate === 'boolean' && typeof value === 'function') {
				// if evaluate is a boolean (remember it is not a falsey value) and the value is a function itself
				value = value.call(context);

			} else if (typeof options.evaluate === 'function') {
				// if options.evaluate is a function, call it and pass it the value as first parameter and name as second
				value = options.evaluate.call(context, name, value);
			}
		}

		return value;
	};


	_.mixin({
		getset: function(data) {
			/*
				data: {
					context: obj,
					obj: obj || string,
					name: string,
					value: whatever,
					options: {
						iterate: function,
						events: string || array || object || function,
						evaluate: boolean || function
					}
				}
			*/
			var context = data.context,
				name = data.name,
				value = data.value,
				options = data.options || {},
				obj = data.obj;

			if (typeof name === 'object') {
				// LOOP SET
				_.each(name, function(val, name) {
					return _.getset({
						context: context,
						obj: obj,
						name: name,
						value: val,
						options: options
					});
				});

				return this;

			} else if (typeof name === 'string' && typeof value !== 'undefined') {
				// PASS TO THE iterate
				value = (typeof options.iterate === 'function') ? options.iterate.call(context, name, value) : value;

				// SET SINGLE
				return gs.set(context, obj, name, value, options);

			} else if (typeof name === 'string') {
				// GET 
				return gs.get(context, obj, name, options);

			} else {
				// GET THE OBJECT ITSELF
				
				// if obj is an array, just get the first object from the array
				// otherwise, keep it as it is.
				obj = _.isArray(obj) ? obj[0] : obj;

				// now that the obj is definetely not an array,
				// if it is a string, it is a namespace.
				if (typeof obj === 'string') {
					// obj is a namespace. Get the object or create it on the context object
					// prevent obj from being non-object
					// if there is no obj, create the object on the context
					context[obj] = obj = context[obj] || {};
				}

				return obj;
			}
		},
	});









	/////////////////////////////
	//////// asynch /////////////
	/////////////////////////////
	_.mixin({
		// _.asynch(common_obj, func1, func2, func3);
		asynch: function(options) {

			var first_arg_is_object = typeof options === 'object',
				// if the first argument is an object,
				// then it should be considered an options object.
				// otherwise, there is no options object
				options = first_arg_is_object ? options : {},

				// the common object
				common = options.common || {},

				// the error handler
				err = options.err || function() {

				},

				// the list of the names of the tasks to be executed
				map = options.map,

				// the function to be run before each task
				before = options.before || function(){},

				// the function to be run after each task
				after = options.after || function(){},

				// context in which the functions should be called
				context = options.context || window,
				lastdefer = true,
				tasks;

			// define the tasks array
			if (first_arg_is_object) {
				// if the first argument is an options object,
				// then there are two possibilities:
				//	1: there is a 'tasks' property in the options object itself
				//	2: tasks were passed in as arguments
				tasks = options.tasks || _.args(arguments, 1);
			} else {
				// if the first argument is not an options object
				// the tasks are the arguments object itself.
				tasks = arguments;
			}

			_.each(tasks, function (task, order) {
				/*
					This code is pretty tricky:
					1: lastdefer starts as true, so that the first task is instantly run.
					2: lsatdefer value is updated at each task loop.
					3: 'when' lastdefer is resolved, a function creates a new defer
						and passes it to the next task. 
					4: if the next task returns a not undefined object, it is set as 
						the 'lastdefer'. This is done so that tasks may return a promise instead 
						of calling next function.
				*/
				
				// only start the new task when the previous one is finished.
				lastdefer = $.when(lastdefer).then(function() {

					// call the after function
					if (order !== 0) {
						var lasttask = typeof map === 'undefined' ? order - 1 : map[ order - 1 ];
						after.call(context, lasttask);
					}

					// call the before function
					var currtask = typeof map === 'undefined' ? order : map[ order ];
					before.call(context, currtask);

					// create the defer object.
					var defer = $.Deferred(),
						next = defer.resolve,
						res = task.call(context, next, common);

					return typeof res !== 'undefined' ? res : defer;
				});

				// set error handler
				lastdefer.fail(err);
			});

			// call the last after
			lastdefer.then(function() {
				var lasttask = typeof map === 'undefined' ? tasks.length - 1 : map[ tasks.length -1 ];
				after.call(context, lasttask);
			})

			// return a defer object.
			return lastdefer;
		},
	});




	//////////////////////
	//////// mapo ////////
	//////////////////////
	_.mixin({
		mapo: function(obj, iter) {
			var res = {};
			
			_.each(obj, function(value, name) {
				res[ name ] = iter(value, name);
			});

			return res;
		}
	})



});