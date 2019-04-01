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
          process.env.MNEMONIC,
          process.env.PROVIDER_URL
        )
      },
      skipDryRun: true
    },
  }
};
