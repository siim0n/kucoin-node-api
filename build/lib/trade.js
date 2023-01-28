import axios from 'axios';
const placeOrder = async function (params) {
    let endpoint = '/api/v1/orders';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
const placeMarginOrder = async function (params) {
    let endpoint = '/api/v1/margin/order';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
const placeFuturesOrder = async function (params) {
    let endpoint = '/api/v1/order';
    let url = this.futuresBaseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST', 'futures'));
    return result.data;
};
/*
  Post borrow order
  POST /api/v1/margin/borrow
  Details for params see https://docs.kucoin.com/#post-borrow-order
  General params
  params = {
    currency: String
    type: string [optional, default: limit] - FOK or IOC
    size: BigDecimal,
    maxRate: BigDecimal [optional] - the maximum interest rate
    term: String - units in days. Can be 7,14 or 28.
  }
*/
const borrow = async function (params) {
    let endpoint = '/api/v1/margin/borrow';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Post isolated borrow order
  POST /api/v1/isolated/borrow
  Details for params see https://docs.kucoin.com/#isolated-margin-borrowing
  General params
  params = {
    symbol: String - BTC-USDT
    currency: String
    size: BigDecimal,
    borrowStrategy: string [required] - FOK or IOC
    maxRate: BigDecimal [optional] - the maximum interest rate
    period: String - units in days. Can be 7,14 or 28.
  }
*/
const isolatedBorrow = async function (params) {
    let endpoint = '/api/v1/isolated/borrow';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Quickly Repay Isolated Margin Account
  POST /api/v1/isolated/repay/all
  Details for params see https://docs.kucoin.com/#quick-repayment
  General params
  params = {
    symbol: String - BTC-USDT
    currency: String
    size: BigDecimal - repayment amount
    seqStrategy: String RECENTLY_EXPIRE_FIRST or HIGHEST_RATE_FIRST
  }
*/
const quickRepayment = async function (params) {
    let endpoint = '/api/v1/isolated/repay/all';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Cancel an order
  DELETE /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
const cancelOrder = async function (params) {
    let endpoint = '/api/v1/orders/' + params.id;
    delete params.id;
    let url = this.baseURL + endpoint;
    let result = await axios.delete(url, this.sign(endpoint, params, 'DELETE'));
    return result.data;
};
/*
  Cancel all orders
  DELETE /api/v1/orders
  params = {
    symbol: string [optional]
  }
*/
const cancelAllOrders = async function (params) {
    let endpoint = '/api/v1/orders';
    let url = this.baseURL + endpoint;
    let result = await axios.delete(url, this.sign(endpoint, params, 'DELETE'));
    return result.data;
};
/*
  List orders
  GET /api/v1/orders
  params = {
    status: string [optional, default: dealt, alt: active]
    symbol: string [optional]
    side: string [optional, 'buy' || 'sell]
    type: string [optional, limit || limit_stop || market_stop]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
  }
*/
const getOrders = async function (params) {
    let endpoint = '/api/v1/orders';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get an order
  GET /api/v1/orders/<order-id>
  params = {
    id: order-id
  }
*/
const getOrderById = async function (params) {
    let endpoint = '/api/v1/orders/' + params.id;
    delete params.id;
    let url = this.baseURL + endpoint;
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  List Fills
  GET /api/v1/fills
  params: {
    orderId: string [optional]
    symbol: string [optional]
    side: string [optional, 'buy' || 'sell]
    type: string [optional]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
  }
*/
const listFills = async function (params = {}) {
    let endpoint = '/api/v1/fills';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  List Your Recent Fills: max 1000 fills in the last 24 hours, all symbols
  GET /api/v1/limit/fills
*/
const recentFills = async function (params = {}) {
    let endpoint = '/api/v1/limit/fills';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get V1 Historical Orders List
  GET /api/v1/hist-orders
  params: {
    currentPage: integer [optional]
    pageSize: integer [optional]
    symbol: string [optional]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    side: string (buy || sell) [optional]
  }
*/
const getV1HistoricalOrders = async function (params) {
    let endpoint = '/api/v1/hist-orders';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Position Details
  GET /api/v1/position?symbol=${symbol}
  Get Position List
  GET /api/v1/positions
  params: {
    symbol: string [optional]
  }
*/
const getPosition = async function (params) {
    let endpoint = '';
    if (params != "") {
        endpoint = `/api/v1/position?symbol=${params}`;
    }
    else {
        endpoint = "/api/v1/positions";
    }
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
const Trade = {
    isolatedBorrow,
    quickRepayment,
    cancelOrder,
    cancelAllOrders,
    getOrders,
    getOrderById,
    listFills,
    recentFills,
    getV1HistoricalOrders,
    getPosition,
    borrow,
    placeFuturesOrder,
    placeOrder,
    placeMarginOrder
};
export default Trade;
