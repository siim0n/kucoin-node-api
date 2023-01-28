import axios from 'axios';
/*
  List Accounts
  GET /api/v1/accounts
  params = {
    currency: string [optional]
    type: string [optional]
  }
*/
const getAccounts = async function (params = {}) {
    let endpoint = '/api/v1/accounts';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Account
  GET /api/v1/accounts/<accountId>
  params {
    id: accountId
  }
*/
const getAccountById = async function (params) {
    let endpoint = '/api/v1/accounts/' + params.id;
    delete params.id;
    let url = this.baseURL + endpoint;
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Create Account
  POST /api/v1/accounts
  params = {
    type: string ['main' || 'trade']
    currency: string
  }
*/
const createAccount = async function (params) {
    let endpoint = '/api/v1/accounts';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Get Account Ledgers
  GET /api/v1/accounts/<accountId>/ledgers
  params = {
    id: string
    startAt: long (unix time)
    endAt: long (unix time)
  }
*/
const getAccountLedgers = async function (params) {
    let endpoint = `/api/v1/accounts/ledgers`;
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Account Ledgers
  GET /api/v1/accounts/<accountId>/ledgers
  params = {
    id: string
    startAt: long (unix time)
    endAt: long (unix time)
  }
*/
const getAccountLedgersOld = async function (params) {
    let endpoint = `/api/v1/accounts/${params.id}/ledgers`;
    delete params.accountId;
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Holds
  GET /api/v1/accounts/<accountId>/holds
  params = {
    id: string
  }
*/
const getHolds = async function (params) {
    let endpoint = `/api/v1/accounts/${params.id}/holds`;
    delete params.id;
    let url = this.baseURL + endpoint;
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Inner Transfer
  POST /api/accounts/inner-transfer
  params = {
    clientOid: string
    currency: string,
    from: string
    to: string
    amount: string
  }
*/
const innerTransfer = async function (params) {
    let endpoint = '/api/v2/accounts/inner-transfer';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Transfer from futures account to kucoin account
  POST /api/v3/transfer-out
  params = {
    amount: Number
    currency: string, e.g. XBT or USDT
    recAccountType: string - 'MAIN' or 'TRADE'
  }
*/
const futuresTransferOut = async function (params) {
    let endpoint = '/api/v3/transfer-out';
    let url = this.futuresBaseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST', 'futures'));
    return result.data;
};
/*
  Transfer into futures account
  POST /api/v1/transfer-in
  params = {
    amount: Number
    currency: string, e.g. XBT or USDT
    payAccountType: string - 'MAIN' or 'TRADE'
  }
*/
const futuresTransferIn = async function (params) {
    let endpoint = '/api/v1/transfer-in';
    let url = this.futuresBaseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST', 'futures'));
    return result.data;
};
/*
  Create Deposit Address
  POST /api/v1/deposit-addresses
  params = {
    currency: string
  }
*/
const createDepositAddress = async function (params) {
    let endpoint = '/api/v1/deposit-addresses';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Get Deposit Address
  GET /api/v1/deposit-addresses?currency=<currency>
  params = {
    currency: string
  }
*/
const getDepositAddress = async function (params) {
    let endpoint = `/api/v2/deposit-addresses?currency=${params.currency}`;
    delete params.currency;
    let url = this.baseURL + endpoint;
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Repay Record
  GET /api/v1/margin/borrow/outstanding
  params = {
    currency: string [optional]
    currentPage: string [optional (default 1)]
    pageSize: string [optional (default 50)]
  }
*/
const getRepayRecord = async function (params = {}) {
    let endpoint = `/api/v1/margin/borrow/outstanding`;
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get isolated Repayment Records
  POST /api/v1/isolated/borrow/outstanding
  Details for params see https://docs.kucoin.com/#query-outstanding-repayment-records
  General params
  params = {
    symbol: String - BTC-USDT
    currency: String
    pageSize: Int [optional]
    currentPage: Int [optional]
  }
*/
const getIsolatedRepayRecord = async function (params = {}) {
    let endpoint = '/api/v1/isolated/borrow/outstanding';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Deposit List
  GET /api/v1/deposits
  params = {
    currency: string [optional]
    startAt: long (unix time)
    endAt: long (unix time)
    status: string [optional]
  }
*/
const getDepositList = async function (params = {}) {
    let endpoint = '/api/v1/deposits';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Margin Account
  GET /api/v1/margin/account
*/
const getMarginAccount = async function () {
    const endpoint = '/api/v1/margin/account';
    const url = this.baseURL + endpoint;
    const result = await axios.get(url, this.sign(endpoint, "", 'GET'));
    return result.data;
};
/*
  Query Single Isolated Margin Account Info
  GET /api/v1/isolated/account/{symbol}
*/
const getIsolatedMarginAccountInfo = async function (params) {
    const endpoint = `/api/v1/isolated/account/${params.symbol}`;
    const url = this.baseURL + endpoint;
    const result = await axios.get(url, this.sign(endpoint, "", 'GET'));
    return result.data;
};
/*
  Get Withdrawals List
  GET /api/v1/withdrawals
  params = {
    currency: string [optional]
    startAt: long (unix time)
    endAt: long (unix time)
    status: string [optional]
  }
*/
const getWithdrawalsList = async function (params = {}) {
    let endpoint = '/api/v1/withdrawals';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get Withdrawal Quotas
  GET /api/v1/withdrawals/quotas
  params = {
    currency: string
  }
*/
const getWithdrawalQuotas = async function (params) {
    let endpoint = '/api/v1/withdrawals/quotas';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Apply Withdrawal
  POST /api/v1/withdrawals
  params = {
    currency: string
    address: string
    amount: number
    memo: string [optional]
    isInner: boolean [optional]
    remark: string [optional]
  }
*/
const applyForWithdrawal = async function (params) {
    let endpoint = '/api/v1/withdrawals';
    let url = this.baseURL + endpoint;
    let result = await axios.post(url, params, this.sign(endpoint, params, 'POST'));
    return result.data;
};
/*
  Cancel Withdrawal
  DELETE /api/v1/withdrawls/<withdrawlId>
  params = {
    withdrawalId: string
  }
*/
const cancelWithdrawal = async function (params) {
    let endpoint = '/api/v1/withdrawls/' + params.withdrawalId;
    delete params.withdrawalId;
    let url = this.baseURL + endpoint;
    let result = await axios.delete(url, this.sign(endpoint, params, 'DELETE'));
    return result.data;
};
/*
  Get V1 Historical Withdrawals List
  GET /api/v1/hist-withdrawals
  params = {
    currentPage: integer [optional]
    pageSize: integer [optional]
    currency: string [optional - currency code]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    status: string [optional] Available value: PROCESSING, SUCCESS, and FAILURE
  }
*/
const getV1HistoricalWithdrawals = async function (params) {
    let endpoint = '/api/v1/hist-withdrawals';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
/*
  Get V1 Historical Deposits List
  GET /api/v1/hist-deposits
  params = {
    currentPage: integer [optional]
    pageSize: integer [optional]
    currency: string [optional - currency code]
    startAt: long (unix time) [optional]
    endAt: long (unix time) [optional]
    status: string [optional] Available value: PROCESSING, SUCCESS, and FAILURE
  }
*/
const getV1HistoricalDeposits = async function (params) {
    let endpoint = '/api/v1/hist-deposits';
    let url = this.baseURL + endpoint + this.formatQuery(params);
    let result = await axios.get(url, this.sign(endpoint, params, 'GET'));
    return result.data;
};
const User = {
    getIsolatedRepayRecord,
    getDepositList,
    getMarginAccount,
    getIsolatedMarginAccountInfo,
    getWithdrawalsList,
    getWithdrawalQuotas,
    applyForWithdrawal,
    cancelWithdrawal,
    getV1HistoricalWithdrawals,
    getV1HistoricalDeposits,
    getRepayRecord,
    getAccounts,
    getAccountById,
    createAccount,
    getAccountLedgers,
    getAccountLedgersOld,
    getHolds,
    innerTransfer,
};
export default User;
