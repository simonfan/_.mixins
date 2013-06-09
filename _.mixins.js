define(['underscore'], function() {

	//////// INTERFACE /////////
	_.mixin({
		interface: function(d) {
			// d: identifier, auxiliary, obj, typeofs
			/*

				typeofs:
					prop: typeof prop (str)
			*/
			
			_.each(d.typeofs, function(expected_type, prop_name) {
				d.aux = d.aux || '';

				if ( _.isArray(expected_type) ) {
					// multiple types accepted
					var actual_type = typeof d.obj[prop_name];

					if ( _.indexOf(expected_type, actual_type) === -1 ) {
						// not present
						throw new TypeError("The property '" + prop_name + "' from " + d.id + " is not a '" + expected_type + "' but a '" + actual_type + "' || " + d.aux);
					}

				} else if ( typeof expected_type === 'object' ) {

					// go recursive
					_.interface({
						id: d.id + ':' + prop_name,
						obj: d.obj[ prop_name ],
						typeofs: expected_type,
					});

				} else {
					// only one type accepted
					var actual_type = typeof d.obj[prop_name];

					if (actual_type === 'undefined') {
						throw new Error("There is no '" + prop_name + "' in " + d.id + ' || ' + d.aux);
					}
					
					if (actual_type != expected_type) {
						throw new TypeError("The property '" + prop_name + "' from " + d.id + " is not a '" + expected_type + "' but a '" + actual_type + "' || " + d.aux);
					}
				}

			});
			
		},
	});


	//////// ARGS /////////
	_.mixin({
		args: function(args) { return Array.prototype.slice.call(args, 0); }
	})
});