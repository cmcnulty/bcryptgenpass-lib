var supergenpass = require('../bcryptgenpass-lib');
var test = require('tape');

test('Expected failures', function (test) {
    var data = [
        ['test', 'example.com', { length: -1 }],
        ['test', 'example.com', { length: 0 }],
        ['test', 'example.com', { length: '12'}],
        ['test', 'example.com', { length: 3 }],
        ['test', 'example.com', { length: 161 }],
        ['test', 'example.com', { secret: false }],
        ['test', 'example.com', { secret: [] }],
        [false, 'example.com'],
        [null, 'example.com'],
        [undefined, 'example.com'],
        ['', 'example.com', { secret: '' }],
		['test', 'example.com', { costFactor: 32 }],
		['test', 'example.com', { costFactor: 3 }],
		['test', 'example.com', { costFactor: "abc" }],
		['test', 'example.com', { costFactor: 7.5 }]
    ];

	test.plan(data.length);
	
    data.forEach(function(c){
        test.throws(function(){
			var t = supergenpass(c[0], c[1], c[2]);
        }, Error, 'Dataset: ' + c[0] + ', ' + c[1] + ', ' + JSON.stringify(c[2]));
    });

});
