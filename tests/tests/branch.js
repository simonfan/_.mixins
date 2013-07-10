define(['_.mixins'], function(undef) {

return function() {

	module('_.branch(root, steps, leaf)');

	test('creating a branch from 0', function() {
		var branch = _.branch({}, ['vegetables','red','tomato'], 'lalalalalala tomato');

		deepEqual(branch, {
			vegetables: {
				red: {
					tomato: 'lalalalalala tomato'
				}
			}
		});
	});

	test('branching an existing object', function() {
		var root = {
				fruits: {
					yellow: {
						bananas: 'bananas',
						pineaples: 'pineaples',
					},
					red: {
						apples: 'apples'
					},
					green: {
						watermelons: 'watermelons',
					}
				},
				vegetables: {
					green: {
						lettuce: 'lettuce',
					},
					yellow: {
						potato: 'potato',
					}
				}
			},
			branch_tomato = ['vegetables','red','tomato'],
			branch_melon = ['fruits','yellow','melon'],
			branch_meat = ['meats','red','beef'];

		root = _.branch(root, branch_tomato, 'tooomato');

		deepEqual(root, {
			fruits: {
				yellow: {
					bananas: 'bananas',
					pineaples: 'pineaples',
				},
				red: {
					apples: 'apples'
				},
				green: {
					watermelons: 'watermelons',
				}
			},
			vegetables: {
				green: {
					lettuce: 'lettuce',
				},
				yellow: {
					potato: 'potato',
				},
				red: {
					tomato: 'tooomato'
				}
			}
		})

	});
}
});