import WebSocket from 'ws'
import  post  from 'axios'




const getPublicWsToken = async function(baseURL: string) {
  let endpoint = '/api/v1/bullet-public'
  let url = baseURL + endpoint
  let result = await post(url, {})
  return result.data
}

const getPrivateWsToken = async function(baseURL: string, sign: { headers: any }) {
  let endpoint = '/api/v1/bullet-private'
  let url = baseURL + endpoint
  let result = await post({
    url: url,
    data: {},
    headers: sign.headers
  });
  return result.data
}

const getSocketEndpoint = async function(type: string, baseURL: any, environment: string, sign: any) {
  let r: { data: { token: any; instanceServers: any[] } }
  if (type == 'private') {
    r = await getPrivateWsToken(baseURL, sign)
  } else { 
    r = await getPublicWsToken(baseURL)
  }
  let token = r.data.token
  let instanceServer = r.data.instanceServers[0]

  if(instanceServer){
    if (environment === 'sandbox') {
      return `${instanceServer.endpoint}?token=${token}&[connectId=${Date.now()}]`
    } else if (environment === 'live') {
      return `${instanceServer.endpoint}?token=${token}&[connectId=${Date.now()}]`
    }
  }else{
    throw Error("No Kucoin WS servers running")
  }
}

/*  
  Initiate a websocket
  params = {
    topic: enum 
    symbols: array [optional depending on topic]
  }
  eventHanlder = function
*/
const initSocket = async function(params: { sign: boolean; endpoint: boolean; topic: any; symbols: any }, eventHandler: any) {
  try {
    if ( !params.sign ) params.sign = false;
    if ( !params.endpoint ) params.endpoint = false;
    let [topic, endpoint, type] = Sockets.topics( params.topic, params.symbols, params.endpoint, params.sign )
    let sign = this.sign('/api/v1/bullet-private', {}, 'POST')
    let websocket = await getSocketEndpoint(type, this.baseURL, this.environment, sign)
    let ws = new WebSocket(websocket)
    Sockets.ws[topic] = ws
    ws.on('open', () => {
      console.log(topic + ' opening websocket connection... ')
      Sockets.subscribe(topic, endpoint, type, eventHandler)
      Sockets.ws[topic].heartbeat = setInterval(Sockets.socketHeartBeat, 20000, topic)
    })
    ws.on('error', (error) => {
      Sockets.handleSocketError(error as unknown as { code: string; message: string })
      console.log(error)
    })
    ws.on('ping', () => {
      return
    })
    ws.on('close', () => {
      clearInterval(Sockets.ws[topic].heartbeat)
      console.log(topic + ' websocket closed...')
    })
  } catch (err) {
    console.log(err)
  }
}

const handleSocketError = function(error: { code: string; message: string }) {
  console.log('WebSocket error: ' + (error.code ? ' (' + error.code + ')' : '') +
  (error.message ? ' ' + error.message : ''))
}

const socketHeartBeat = function(topic: string | number) {
  let ws = Sockets.ws[topic]
  ws.ping()
}

const subscribe = async function(topic: string | number, endpoint: any, type: string, eventHandler: any) {
  let ws = Sockets.ws[topic]
  if (type === 'private') {
    ws.send(JSON.stringify({
      id: Date.now(),
      type: 'subscribe',
      topic: endpoint,
      privateChannel: true,
      response: true
    }))
  } else {
    ws.send(JSON.stringify({
      id: Date.now(),
      type: 'subscribe',
      topic: endpoint,
      response: true
    }))
  }
  ws.on('message', eventHandler)
}

const unsubscribe = async function(topic: string | number, endpoint: any, type: any, eventHandler: any) {
  let ws = Sockets.ws[topic]
  ws.send(JSON.stringify({
    id: Date.now(),
    type: 'unsubscribe',
    topic: endpoint,
    response: true
  }))
  ws.on('message', eventHandler)
}

const topics = function( topic: string, symbols = [], endpoint = false, sign = false ) {
    if ( endpoint ) return [topic, endpoint + ( symbols.length > 0 ? ':' : '' ) + symbols.join( ',' ), sign ? 'private' : 'public']
    if ( topic === 'ticker' ) {
        return [topic, "/market/ticker:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'allTicker' ) {
        return [topic, "/market/ticker:all", 'public']
    } else if ( topic === 'symbolSnapshot' ) {
        return [topic, "/market/snapshot:" + symbols[0], 'public']
    } else if ( topic === 'marketSnapshot' ) {
        return [topic, "/market/snapshot:" + symbols[0], 'public']
    } else if ( topic === 'orderbook' ) {
        return [topic, "/market/level2:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'match' ) {
        return [topic, "/market/match:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'fullMatch' ) {
        return [topic, "/spotMarket/level3:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'orders' ) {
        return [topic, "/spotMarket/tradeOrders", 'private']
    } else if ( topic === 'balances' ) {
        return [topic, "/account/balance", 'private']
    } else if ( topic === 'depth50' ) {
        return [topic, "/spotMarket/level2Depth50:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'depth5' ) {
        return [topic, "/spotMarket/level2Depth5:" + symbols.join( ',' ), 'public']
    } else if ( topic === 'advancedOrders' ) {
        return [topic, "/spotMarket/advancedOrders", 'private']
    }
}
export interface Sockets {
  topics: (topic: string, symbols?: any[], endpoint?: boolean, sign?: boolean) => string[];
  subscribe(topic: any, endpoint: any, type: any, eventHandler: any): unknown;
  socketHeartBeat(socketHeartBeat: any, arg1: number, topic: any): any;
  handleSocketError(error: {code: string, message: string}): unknown;
  unsubscribe: (topic: string | number, endpoint: any, type: any, eventHandler: any) => Promise<void>;
  initSocket: (params: { sign: boolean; endpoint: boolean; topic: any; symbols: any }, eventHandler: any) => Promise<void>
  ws: any
  heartbeat: any
}
const Sockets: Sockets = {
  topics,
  subscribe,
  socketHeartBeat,
  handleSocketError,
  unsubscribe,
  initSocket,
  ws: {},
  heartbeat: {}
}

export default Sockets
