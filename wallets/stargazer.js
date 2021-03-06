'use strict';
const StellarSdk = require('stellar-sdk');

const stargazerAccountQr = (accountId) => {
  return {
    stellar: {
      account: {
        id: accountId
      }
    }
  };
};
const stargazerPaymentQr = ({networkHash, networkPassphrase, accountId, amount, memoType, memo, assetCode, assetIssuer}) => {
  if (!accountId) {
    throw new Error('accountId is required')
  }
  let result = {
    stellar: {
      payment: {
        destination: accountId,
        amount: amount,
      }
    }
  };

  if (networkHash || networkPassphrase) {
    if (!networkPassphrase) {
      networkPassphrase = StellarSdk.Networks.PUBLIC;
    }
    result.stellar.payment.network = networkHash ||
      new StellarSdk.Network(networkPassphrase).networkId().toString('hex').slice(0, 8);
  }
  if (assetCode !== 'XLM') {
    result.stellar.payment.asset = {
      code: assetCode,
      issuer: assetIssuer
    };
  }
  if (memo && memoType) {
    result.stellar.payment.memo = {
      type: memoType,
      value: memo
    };
  }
  return result;
};

module.exports = {
  getQR: ({networkHash, accountId, memoType, memo, amount, assetCode, assetIssuer}) => {
    return JSON.stringify(
      amount ? stargazerPaymentQr({networkHash, accountId, memoType, memo, amount, assetCode, assetIssuer}) :
      stargazerAccountQr(accountId)
    );
  }
};