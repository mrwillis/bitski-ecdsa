const BitskiConfig = require('./bitski.config.js');
const BitskiTruffleProvider = require('bitski-truffle-provider');

module.exports = {
  compilers: {
    solc: {
      version: "0.5.2"
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
    live: {
      network_id: '1',
      provider: () => {
        return BitskiTruffleProvider("mainnet", BitskiConfig.appWallet)
      }
    },
    kovan: {
      network_id: '42',
      provider: () => {
        return BitskiTruffleProvider("kovan", BitskiConfig.appWallet)
      }
    },
    rinkeby: {
      network_id: '4',
      provider: () => {
        return BitskiTruffleProvider("rinkeby", BitskiConfig.appWallet)
      }
    }
  }
};
