var supergenpass = require('../bcryptgenpass-lib');
var test = require('tape');

var opts = {costFactor: 6};
var data = [
    ['h-Ce7h8c{#gb', 'Γαζέες καὶ μυρτιὲς δὲν θὰ βρῶ πιὰ στὸ χρυσαφὶ ξέφωτο', opts],
    ['v{@[5wJsoSfG', 'Benjamín pidió una bebida de kiwi y fresa', opts],
    ['iwL1#hdZiaix', 'Ça me fait peur de fêter noël là, sur cette île bizarroïde où', opts],
    ['ias<9gbyT}h9', 'Árvíztűrő tükörfúrógép', opts],
    ['wI#L9fF$Z$wJ', 'わかよたれそつねならむ', opts],
    ['f<#$GwO2vWv}', 'ウヰノオクヤマ ケフコエテ', opts],
    ['g+Z!0iBT{SfF', 'מצא לו חברה איך הקליטה', opts],
    ['w&zXVw?Vk7hA', 'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!', opts],
    ['fG0DJf!^9Gh8', 'จงฝ่าฟันพัฒนาวิชาการ', opts]
].map(function(row){
    return {
        input: row[1],
        sgp: row[0]
    };
});

test('unicode comparisons', function (test) {

	test.plan(data.length);

    data.forEach(function(row){
        test.equal(supergenpass(row.input, 'example.com'), row.sgp);
    });
    
});
