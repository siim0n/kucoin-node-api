"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const axios_1 = __importDefault(require("axios"));
const getPublicWsToken = async function (baseURL) {
    let endpoint = '/api/v1/bullet-public';
    let url = baseURL + endpoint;
    let result = await (0, axios_1.default)(url, {});
    return result.data;
};
const getPrivateWsToken = async function (baseURL, sign) {
    let endpoint = '/api/v1/bullet-private';
    let url = baseURL + endpoint;
    let result = await (0, axios_1.default)({
        url: url,
        data: {},
        headers: sign.headers
    });
    return result.data;
};
const getSocketEndpoint = async function (type, baseURL, environment, sign) {
    let r;
    if (type == 'private') {
        r = await getPrivateWsToken(baseURL, sign);
    }
    else {
        r = await getPublicWsToken(baseURL);
    }
    let token = r.data.token;
    let instanceServer = r.data.instanceServers[0];
    if (instanceServer) {
        if (environment === 'sandbox') {
            return `${instanceServer.endpoint}?token=${token}&[connectId=${Date.now()}]`;
        }
        else if (environment === 'live') {
            return `${instanceServer.endpoint}?token=${token}&[connectId=${Date.now()}]`;
        }
    }
    else {
        throw Error("No Kucoin WS servers running");
    }
};
/*
  Initiate a websocket
  params = {
    topic: enum
    symbols: array [optional depending on topic]
  }
  eventHanlder = function
*/
const initSocket = async function (params, eventHandler) {
    try {
        if (!params.sign)
            params.sign = false;
        if (!params.endpoint)
            params.endpoint = false;
        let [topic, endpoint, type] = Sockets.topics(params.topic, params.symbols, params.endpoint, params.sign);
        let sign = this.sign('/api/v1/bullet-private', {}, 'POST');
        let websocket = await getSocketEndpoint(type, this.baseURL, this.environment, sign);
        let ws = new ws_1.default(websocket);
        Sockets.ws[topic] = ws;
        ws.on('open', () => {
            console.log(topic + ' opening websocket connection... ');
            Sockets.subscribe(topic, endpoint, type, eventHandler);
            Sockets.ws[topic].heartbeat = setInterval(Sockets.socketHeartBeat, 20000, topic);
        });
        ws.on('error', (error) => {
            Sockets.handleSocketError(error);
            console.log(error);
        });
        ws.on('ping', () => {
            return;
        });
        ws.on('close', () => {
            clearInterval(Sockets.ws[topic].heartbeat);
            console.log(topic + ' websocket closed...');
        });
    }
    catch (err) {
        console.log(err);
    }
};
const handleSocketError = function (error) {
    console.log('WebSocket error: ' + (error.code ? ' (' + error.code + ')' : '') +
        (error.message ? ' ' + error.message : ''));
};
const socketHeartBeat = function (topic) {
    let ws = Sockets.ws[topic];
    ws.ping();
};
const subscribe = async function (topic, endpoint, type, eventHandler) {
    let ws = Sockets.ws[topic];
    if (type === 'private') {
        ws.send(JSON.stringify({
            id: Date.now(),
            type: 'subscribe',
            topic: endpoint,
            privateChannel: true,
            response: true
        }));
    }
    else {
        ws.send(JSON.stringify({
            id: Date.now(),
            type: 'subscribe',
            topic: endpoint,
            response: true
        }));
    }
    ws.on('message', eventHandler);
};
const unsubscribe = async function (topic, endpoint, type, eventHandler) {
    let ws = Sockets.ws[topic];
    ws.send(JSON.stringify({
        id: Date.now(),
        type: 'unsubscribe',
        topic: endpoint,
        response: true
    }));
    ws.on('message', eventHandler);
};
const topics = function (topic, symbols = [], endpoint = false, sign = false) {
    if (endpoint)
        return [topic, endpoint + (symbols.length > 0 ? ':' : '') + symbols.join(','), sign ? 'private' : 'public'];
    if (topic === 'ticker') {
        return [topic, "/market/ticker:" + symbols.join(','), 'public'];
    }
    else if (topic === 'allTicker') {
        return [topic, "/market/ticker:all", 'public'];
    }
    else if (topic === 'symbolSnapshot') {
        return [topic, "/market/snapshot:" + symbols[0], 'public'];
    }
    else if (topic === 'marketSnapshot') {
        return [topic, "/market/snapshot:" + symbols[0], 'public'];
    }
    else if (topic === 'orderbook') {
        return [topic, "/market/level2:" + symbols.join(','), 'public'];
    }
    else if (topic === 'match') {
        return [topic, "/market/match:" + symbols.join(','), 'public'];
    }
    else if (topic === 'fullMatch') {
        return [topic, "/spotMarket/level3:" + symbols.join(','), 'public'];
    }
    else if (topic === 'orders') {
        return [topic, "/spotMarket/tradeOrders", 'private'];
    }
    else if (topic === 'balances') {
        return [topic, "/account/balance", 'private'];
    }
    else if (topic === 'depth50') {
        return [topic, "/spotMarket/level2Depth50:" + symbols.join(','), 'public'];
    }
    else if (topic === 'depth5') {
        return [topic, "/spotMarket/level2Depth5:" + symbols.join(','), 'public'];
    }
    else if (topic === 'advancedOrders') {
        return [topic, "/spotMarket/advancedOrders", 'private'];
    }
};
const Sockets = {
    topics,
    subscribe,
    socketHeartBeat,
    handleSocketError,
    unsubscribe,
    initSocket,
    ws: {},
    heartbeat: {}
};
exports.default = Sockets;
