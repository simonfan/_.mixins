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
	})
});