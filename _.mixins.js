define(['underscore'], function() {

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
});