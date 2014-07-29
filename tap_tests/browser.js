var supergenpass = require('../bcryptgenpass-lib');
var test = require('tape');


test('simple comparisons', function (test) {
	
    var data = [
        ['fG9w#whDn5fF', 'test', 'example.com'],
        ['i5>C', 'test', 'example.com', { length: 4, costFactor: 10 }],
        ['v>.HKg?6]LwIVq4f/7:Aw[iO', 'test', 'example.com', { length: 24, costFactor: 11 }],
        ['wh=kKg?6#Ovl', 'test', 'example.com', { length: 12, secret: 'test', costFactor: 8 }]
    ];

	test.plan(data.length);

    data.forEach(function(c){
        test.equal(supergenpass(c[1], c[2], c[3]), c[0]);
    });

});
