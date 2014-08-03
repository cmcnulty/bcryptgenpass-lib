var supergenpass = require('../bcryptgenpass-lib');
var test = require('tape');

test('simple comparisons', function (test) {
	
    var data = [
        ['iaL0Wgb7WAg+', 'test', 'example.com', { costFactor: 4 }],
        ['w[9P', 'test', 'example.com', { length: 4, costFactor: 4 }],
        ['iaL0Wgb7WAg+@U$iwUe8fGy*', 'test', 'example.com', { length: 24, costFactor: 4 }],
        ['ggB&Kw&RO8i5', 'test', 'example.com', { length: 12, secret: 'test', costFactor: 4 }]
    ];
	
	test.plan(data.length);

    data.forEach(function(c){
        test.equal(supergenpass(c[1], c[2], c[3]), c[0]);
    });

});

test('asynchronous comparisons', function (test) {
	
	var callback = function( expected, actual ){
		test.equal(expected, actual);
	};	
	var aSyncData = [
        ['test', 'example.com', { costFactor: 4, callback: callback.bind( null, 'iaL0Wgb7WAg+') } ],
		['test', 'example.com', { costFactor: 4, callback: callback.bind( null, 'w[9P'), length: 4 } ]
	];

	test.plan(aSyncData.length);

    aSyncData.forEach(function(c){
        supergenpass(c[0], c[1], c[2]);
    });

});
