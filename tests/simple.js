var supergenpass = require('../bcryptgenpass-lib');

exports.testSimple = function(test){
    var data = [
        ['=`lMr7nmMN', 'test', 'example.com'],
        ['6qM]', 'test', 'example.com', { length: 4, cost: 10 }],
        [';`$fq;+Ff$=^kQ*<H_Gb10S^', 'test', 'example.com', { length: 24, costFactor: 11 }],
        ['6t]M=93-:)F*', 'test', 'example.com', { length: 12, secret: 'test' }]
    ];

    data.forEach(function(c){
        test.equal(supergenpass(c[1], c[2], c[3]), c[0]);
    });

    test.done();
};
