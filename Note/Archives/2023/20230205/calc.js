const plus = 1.05;
const monthlyYuan = 2700;
const years = 15;
let sum = 0;

for (let i = 1; i <= years; i++) {
  const curYearYuan = monthlyYuan *  Math.pow(plus, i)
  console.log('begin:', i);
  console.log('this year:', curYearYuan);
  sum = sum + (curYearYuan);
  console.log('this year sum:', sum);
  console.log('end:', i);
}

console.log('ulti sum:', sum);
