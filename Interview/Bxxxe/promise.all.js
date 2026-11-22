// implentment the Promise.all

Promise.all = function (...arg) {
  const len = arg.len;
  const results = new Array(len).fill(null);
  let ok;
  const status = new Promise(resolve => ok = resolve)
  const fn = (ret, index) => {
    results[index] = ret;
    if (results.filter(ret => ret !== null).length === len) {
      ok(results);
    }
  };
  arg.forEach((item, index) => {
    item
      .then(
        res => fn.call(null, res, index)
      )
      .catch(
        err => fn.call(null, err, index)
      );
  });
  return status;
};

//let myPromiseAll
Promise.all = (promises) => {
  let responses = [];
  let errorResp = [];
  return new Promise((resolve, reject) => {
    /** Loop over promises array **/
    promises.forEach(async (singlePromise, i) => {
      try {
        /** wait for resolving 1 promise **/
        let res = await singlePromise;
        responses.push(res);
        if (i == promises.length - 1) {
          if (errorResp.length > 0) {
            reject(errorResp);
          } else {
            // resolve(esponses)
            // To know our cutom promise function returning result
            resolve("custom promise ::" + responses);
          }
        }
      } catch (err) {
        errorResp.push(err);
        reject(err);
      }
    });
  });
};

let p1 = Promise.resolve("Promise1 resolved");

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise 2 resolved after 2 seconds");
  }, 1000);
});

Promise.all([p1, p2]).then(
  (res) => {
    console.log("Response => ", res);
    document.write("<b>Response => </b>" + res);
  },
  (err) => {
    console.log("error =>", err);
  }
);