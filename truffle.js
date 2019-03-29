const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  compilers: {
    solc: {
      version: "0.5.7"
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      network_id: '4',
      provider: () => {
        return new HDWalletProvider(
          "cabin time talent maximum wrestle surround bind fitness decade uphold dish trip",
          "https://rinkeby.infura.io/v3/c244942c16f64e0aa88fc097d69c3566"
        )
      },
      skipDryRun: true
    },
  }
};
