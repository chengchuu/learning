// original

const o = [
  {
    "monthOfYear": "2022-01",
  },
  {
    "monthOfYear": "2022-01",
  },
  {
    "monthOfYear": "2022-02",
  },
  {
    "monthOfYear": "2022-02",
  },
  {
    "monthOfYear": "2022-03",
  }
];

// target

// function
function foo (items) {
  const monthsMap = {};
  return items.map(item => {
    const { monthOfYear } = item;
    if (!monthsMap[monthOfYear]) {
      Object.assign(item, {
        flag: 1,
      });
      monthsMap[monthOfYear] = 1;
    }
    return item;
  });
}

console.log('result', foo(o));