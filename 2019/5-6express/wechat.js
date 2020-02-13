const crypto = require('crypto')
// const compose = (...arg) => x => arg.reduceRight((acc,f) => f(acc),x)
class Wechat {
  constructor(config) {
    this.token = config.token
  }
  static of(config) {
    return new Wechat(config)
  }
  genSignature(req) {
    let {timestamp,nonce} = req.query,
    result = crypto.createHash('sha1').update([this.token,timestamp,nonce].sort().join(''),'utf8').digest('hex');
    return result
  }
  isFromWx(req) {
    return this.genSignature(req) === req.query.signature
  }
}
exports = Wechat