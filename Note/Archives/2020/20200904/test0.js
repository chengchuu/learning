console.log(Buffer.from(JSON.stringify({ 'type': 'send_cdkey_reward', 'uid': '123', 'cdkey': 'xxxxx' })).toString('base64'));

console.log(Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'))


var crypto = require('crypto')
/**
  *@param   str 字符串
   @param   key 秘钥
  */
function md5(str, key) {
  const decipher = crypto.createHash('md5', key)
  return decipher.update(str).digest('hex')
}
const b = Buffer.from(JSON.stringify({ 'type': 'send_cdkey_reward', 'uid': '123', 'cdkey': 'xxxxx' })).toString('base64')
console.log(md5(b, 'eyJ0eXBlIjoicXVlcnlfcm9sZV9pbmZvIiwibGlsaXRoX2lkIjoyLCJhcHBfaWQiOjUwMTIwOX0='), typeof md5(b, 'ijBlrj8Gw4'))