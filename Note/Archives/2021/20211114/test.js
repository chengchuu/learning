// 模拟网络请求
function simulateRequest () {
  const time = 1000;
  return new Promise(resolve => setTimeout(() => {
      resolve();
      console.log(`模拟请求花费 ${time}ms`);
  }, time));
}

// 循环顺序请求
function cycleRequest () {
  console.log('新的一轮开始请求');
  // 间隔 1 秒
  const arr = new Array(10).fill(undefined);
  arr.reduce(async (last, curr, index) => {
    await last;
    return simulateRequest()
      .then(() => {
        if (index + 1 === arr.length) {
          // 完成一轮后重复
          cycleRequest();
        }
      });
  }, undefined);
}

// 启动
cycleRequest();