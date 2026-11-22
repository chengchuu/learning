const base64 = require('js-base64');
const { generateRndNum } = require('mazey');
const b1Str = base64.encodeURI('1#2#3');
const b2Str = base64.encodeURI(b1Str);
console.log(`第一次：${b1Str}`);
console.log(`第二次：${b2Str}`);

// TVRBMU5EVWpOall5TmpRMk9DTTFNREExTnpZ
// const str = 
// console.log(`第一次 decode：${base64.decode('TVRBMU5EVWpOall5TmpRMk9DTTFNREExTnpZ')}`);
// console.log(`第二次 decode：${base64.decode('MTA1NDUjNjYyNjQ2OCM1MDA1NzY')}`);


console.log(generateRndNum(1));
console.log(generateRndNum(1));
console.log(generateRndNum(1));
console.log(generateRndNum(1));
