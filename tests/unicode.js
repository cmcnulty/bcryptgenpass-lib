var supergenpass = require('../bcryptgenpass-lib');
var test = require('tape');

var opts = {costFactor: 4};
var data = [
    ['f!>Hxiwt58iC', 'Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο', opts],
    ['fG9G1fK[MHwJ', 'Benjamín pidió una bebida de kiwi y fresa', opts],
    ['v}fafw?WWJh8', 'Ça me fait peur de fêter noël là, sur cette île bizarroïde où', opts],
    ['vLGL]gD5U#gC', 'Árvíztűrő tükörfúrógép', opts],
    ['fGp^ygI79bfG', 'わかよたれそつねならむ', opts],
    ['h8WcDf/rM4gg', 'ウヰノオクヤマ ケフコエテ', opts],
    ['gHS0(whW%Pw&', 'מצא לו חברה איך הקליטה', opts],
    ['w[0YhwNNPhhd', 'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!', opts],
    ['gI6#IhzE3%h.', 'จงฝ่าฟันพัฒนาวิชาการ', opts]
].map(function(row){
    return {
        input: row[1],
        sgp: row[0],
		opts: row[2]
    };
});

test('unicode comparisons', function (test) {

	test.plan(data.length);

    data.forEach(function(row){
        test.equal(supergenpass(row.input, 'example.com', row.opts), row.sgp);
    });
    
});
