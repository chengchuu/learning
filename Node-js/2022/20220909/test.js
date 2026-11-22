const p = new Promise(resolve => {
  // throw new Error('ins');
  resolve(233)
}, 3000);

p
  .then(r => {
    throw new Error('then');
  }, e => {
    console.log('then u', e);
  })
  // .catch(e => {
  //   console.log('catch u', e);
  // })
