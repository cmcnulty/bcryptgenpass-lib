var supergenpass = require('../bcryptgenpass-lib');

var data = [
    [';_*)H2bGrJ', 'Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο'],
    ['0Lo8fB.IsZ', 'Benjamín pidió una bebida de kiwi y fresa'],
    ['0kWs3<b49E', 'Ça me fait peur de fêter noël là, sur cette île bizarroïde où'],
    ['2)[Hd:/4?)', 'Árvíztűrő tükörfúrógép'],
    [';g2tl:0LJ5', 'わかよたれそつねならむ'],
    ['DJi*k6"Nl(', 'ウヰノオクヤマ ケフコエテ'],
    ['H=^tp93FPl', 'מצא לו חברה איך הקליטה'],
    ['CfP=UB1c39', 'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!'],
    ['EcEsX04Ja>', 'จงฝ่าฟันพัฒนาวิชาการ']
].map(function(row){
    return {
        input: row[1],
        sgp: row[0]
    };
});

exports.testUnicode = function(test){
    data.forEach(function(row){
        test.equal(supergenpass(row.input, 'example.com'), row.sgp);
    });
    test.done();
};
