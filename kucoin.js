const qs = require('querystring')
const crypto = require('crypto')

const Kucoin = {
  init: function(config) {
    let url = ''
    let futuresUrl = ''
    if (config.environment === 'live') {
      url = 'https://api.kucoin.com';
      futuresUrl = 'https://api-futures.kucoin.com';
    } else {
      url = 'https://openapi-sandbox.kucoin.com'
      futuresUrl = 'https://api-sandbox-futures.kucoin.com';
    }
    this.environment = config.environment
    this.baseURL = url
    this.futuresBaseURL = futuresUrl;
    this.standard = {
      secretKey: config.standard.secretKey,
      apiKey: config.standard.apiKey,
      passphrase: config.standard.passphrase
    }
    this.futures = {
      secretKey: config.futures.secretKey,
      apiKey: config.futures.apiKey,
      passphrase: config.futures.passphrase
    }

    const User = require('./lib/user')
    const Market = require('./lib/market')
    const Trade = require('./lib/trade')
    const Sockets = require('./lib/websockets')
    Object.assign(this, User, Market, Trade, Sockets)
  },
  sign: function(endpoint, params, method, type='standard') {
    let secretKey, passphrase, apiKey;
    if (type === 'futures') {
      secretKey = this.futures.secretKey;
      passphrase = this.futures.passphrase;
      apiKey = this.futures.apiKey;
    }
    else {
      secretKey = this.standard.secretKey;
      passphrase = this.standard.passphrase;
      apiKey = this.standard.apiKey;
    }
    
    let header = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    let nonce = Date.now() + ''
    let strForSign = ''
    if (method === 'GET' || method === 'DELETE') {
      strForSign = nonce + method + endpoint + this.formatQuery(params)
    } else {
      strForSign = nonce + method + endpoint + JSON.stringify(params)
    }
    let signatureResult = crypto.createHmac('sha256', secretKey)
      .update(strForSign)
      .digest('base64')
    let passphraseResult = crypto.createHmac('sha256', secretKey)
      .update(passphrase)
      .digest('base64')
    header.headers['KC-API-SIGN'] = signatureResult
    header.headers['KC-API-TIMESTAMP'] = nonce
    header.headers['KC-API-KEY'] = apiKey
    header.headers['KC-API-PASSPHRASE'] = passphraseResult
    header.headers['KC-API-KEY-VERSION'] = 2
    return header
  },
  formatQuery: function(queryObj) {
    if (JSON.stringify(queryObj).length !== 2) {
      return '?' + qs.stringify(queryObj)
    } else {
      return ''
    }
  }
}

module.exports = Kucoin