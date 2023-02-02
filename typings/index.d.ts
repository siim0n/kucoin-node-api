declare module 'kucoin-node-api' {

  export class KuCoin {
    init: (config: KucoinConfig) => void;
    sign: (endpoint: string, params: any, method: string, type?: string) => any;
    baseURL: string;
    futuresBaseURL: string;
    environment: string;
    standard: {
      secretKey: string;
      apiKey: string;
      passphrase: string;
    };
    futures: {
      secretKey: string;
      apiKey: string;
      passphrase: string;
    };
    trade: Trade
    market: Market
    user: User
    websockets: Sockets
  }
  export const kucoin: KuCoin;
}


interface Market {
  getTicker: (symbol: string) => Promise<any>
  getAllTickers: () => Promise<any>
  get24hrStats: (symbol: string) => Promise<any>
  getMarketList: () => Promise<any>
  getPartOrderBook: (params: { amount: number, symbol: string }) => Promise<any>
  getOrderBook: (symbol: string) => Promise<any>
  getFullOrderBook: (symbol: string) => Promise<any>
  getFullOrderBookAtomic: (symbol: string) => Promise<any>
  getTradeHistories: (symbol: string) => Promise<any>
  getKlines: (params: { symbol: string, startAt: string, endAt: string, type: string }) => Promise<any>
  getCurrencies: () => Promise<any>
  getCurrency: (currency: string) => Promise<any>
  getFiatPrice: (params: { base?: string; currencies: string[] }) => Promise<any>
  getServerTime: () => Promise<any>
  getSymbols: () => Promise<any>
}
interface PlaceOrderParams {
  clientOid: string
  side: string
  symbol: string
  type: string
  remark: string
  stop: string
  stopPrice: string
  stp: string
  price: string
  size: string
  timeInForce: string
  cancelAfter: number
  hidden: boolean
  Iceberg: boolean
  visibleSize: string
}
interface PlaceMarginOrderParams {
  clientOid: string
  side: string
  symbol: string
  type: string
  remark: string
  stop: string
  stopPrice: string
  stp: string
  marginModel: string
  autoBorrow: boolean
  price: string
  size: string
  timeInForce: string
  cancelAfter: number
  hidden: boolean
  Iceberg: boolean
  visibleSize: string
}
interface PlaceFuturesOrderParams {
  clientOid: string
  side: string
  symbol: string
  type: string
  price: string
  size: string
  leverage: string
  timeInForce?: string
  remark?: string
  stop?: string
  stopPrice?: string
  stopPriceType?: string
  reduceOnly?: boolean
  closeOrder?: boolean
  forceHold?: boolean



  postOnly?: boolean
  hidden?: boolean
  Iceberg?: boolean
  visibleSize?: string
}
export interface Trade {
  getPosition: (params: string) => Promise<any>
  getV1HistoricalOrders: (params: any) => Promise<any>
  recentFills: (params: any) => Promise<any>
  listFills: (params: any) => Promise<any>
  getOrderById: (params: { id: string }) => Promise<any>
  getOrders: (params: any) => Promise<any>
  cancelAllOrders: (params: any) => Promise<any>
  cancelOrder: (params: { id: string }) => Promise<any>
  quickRepayment: (params: any) => Promise<any>
  isolatedBorrow: (params: any) => Promise<any>
  borrow: (params: any) => Promise<any>
  placeOrder(params: PlaceOrderParams): Promise<any>
  placeMarginOrder(params: PlaceMarginOrderParams): Promise<any>
  placeFuturesOrder(params: PlaceFuturesOrderParams): Promise<any>
}
export interface User {
  getIsolatedRepayRecord: (params: { symbol: string, startTime?: number, endTime?: number, limit?: number, fromId?: number }) => Promise<any>
  getDepositList: (params: { currency?: string, startAt?: number, endAt?: number, status?: string }) => Promise<any>
  getMarginAccount: () => Promise<any>
  getIsolatedMarginAccountInfo: (params: { symbol: string }) => Promise<any>
  getWithdrawalsList: (params: { currency?: string, startAt?: number, endAt?: number, status?: string }) => Promise<any>
  getWithdrawalQuotas: (params: { currency: string }) => Promise<any>
  applyForWithdrawal: (params: { currency: string, address: string, amount: number, memo?: string, isInner?: boolean, remark?: string }) => Promise<any>
  cancelWithdrawal: (params: { withdrawalId: string }) => Promise<any>
  getV1HistoricalWithdrawals: (params: { currentPage?: number, pageSize?: number, currency?: string, startAt?: number, endAt?: number, status?: string }) => Promise<any>
  getV1HistoricalDeposits: (params: { currentPage?: number, pageSize?: number, currency?: string, startAt?: number, endAt?: number, status?: string }) => Promise<any>
  getRepayRecord: (params: { symbol: string, startTime?: number, endTime?: number, limit?: number, fromId?: number }) => Promise<any>
  getAccounts: () => Promise<any>
  getAccountById: (params: { accountId: string }) => Promise<any>
  createAccount: (params: { type: string }) => Promise<any>
  getAccountLedgers: (params: { accountId: string, currency?: string, startAt?: number, endAt?: number, limit?: number, fromId?: number }) => Promise<any>
  getAccountLedgersOld: (params: { accountId: string, currency?: string, startAt?: number, endAt?: number, limit?: number, fromId?: number }) => Promise<any>
  getHolds: (params: { accountId: string, currency?: string, startAt?: number, endAt?: number, limit?: number, fromId?: number }) => Promise<any>
  innerTransfer: (params: { from: string, to: string, currency: string, amount: number }) => Promise<any>
}

export interface Sockets {
  topics: (topic: string, symbols?: any[], endpoint?: boolean, sign?: boolean) => string[];
  subscribe(topic: any, endpoint: any, type: any, eventHandler: any): unknown;
  socketHeartBeat(socketHeartBeat: any, arg1: number, topic: any): any;
  handleSocketError(error: { code: string, message: string }): unknown;
  unsubscribe: (topic: string | number, endpoint: any, type: any, eventHandler: any) => Promise<void>;
  initSocket: (params: { sign: boolean; endpoint: boolean; topic: any; symbols: any }, eventHandler: any) => Promise<void>
  ws: any
  heartbeat: any
}
export interface KucoinConfig {
  environment: string;
  standard: {
    secretKey: string;
    apiKey: string;
    passphrase: string;
  };
  futures: {
    secretKey: string;
    apiKey: string;
    passphrase: string;
  };
}


