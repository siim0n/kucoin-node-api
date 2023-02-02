"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const crypto_1 = __importDefault(require("crypto"));
const user_js_1 = __importDefault(require("./lib/user.js"));
const market_js_1 = __importDefault(require("./lib/market.js"));
const trade_js_1 = __importDefault(require("./lib/trade.js"));
const websockets_js_1 = __importDefault(require("./lib/websockets.js"));
const Kucoin = {
    init: function (config) {
        let url = '';
        let futuresUrl = '';
        if (config.environment === 'live') {
            url = 'https://api.kucoin.com';
            futuresUrl = 'https://api-futures.kucoin.com';
        }
        else {
            url = 'https://openapi-sandbox.kucoin.com';
            futuresUrl = 'https://api-sandbox-futures.kucoin.com';
        }
        this.environment = config.environment;
        this.baseURL = url;
        this.futuresBaseURL = futuresUrl;
        this.standard = {
            secretKey: config.standard.secretKey,
            apiKey: config.standard.apiKey,
            passphrase: config.standard.passphrase
        };
        this.futures = {};
        if (config.futures) {
            this.futures = Object.assign(this.futures, config.futures);
        }
    },
    sign: function (endpoint, params, method, type = 'standard') {
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
        };
        let nonce = Date.now() + '';
        let strForSign = '';
        if (method === 'GET' || method === 'DELETE') {
            strForSign = nonce + method + endpoint + this.formatQuery(params);
        }
        else {
            strForSign = nonce + method + endpoint + JSON.stringify(params);
        }
        let signatureResult = crypto_1.default.createHmac('sha256', secretKey)
            .update(strForSign)
            .digest('base64');
        let passphraseResult = crypto_1.default.createHmac('sha256', secretKey)
            .update(passphrase)
            .digest('base64');
        header.headers['KC-API-SIGN'] = signatureResult;
        header.headers['KC-API-TIMESTAMP'] = nonce;
        header.headers['KC-API-KEY'] = apiKey;
        header.headers['KC-API-PASSPHRASE'] = passphraseResult;
        header.headers['KC-API-KEY-VERSION'] = 2;
        return header;
    },
    formatQuery: function (queryObj) {
        if (JSON.stringify(queryObj).length !== 2) {
            return '?' + querystring_1.default.stringify(queryObj);
        }
        else {
            return '';
        }
    },
    trade: trade_js_1.default,
    market: market_js_1.default,
    user: user_js_1.default,
    sockets: websockets_js_1.default
};
exports.default = Kucoin;
