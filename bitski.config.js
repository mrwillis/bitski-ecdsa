module.exports = {
  app: {
    id: 'CLIENT_ID' //change this to your app's client id
  },
  appWallet: {
    client: {
      //if you have an app wallet, add your client id and secret here
      id: 'id',
      secret: 'secret'
    },
    auth: {
      tokenHost: 'https://account.bitski.com',
      tokenPath: '/oauth2/token'
    }
  },
  environments: {
    development: {
      network: 'development', //ethereum network to use for local dev
      redirectURL: 'http://localhost:3000/public/callback.html' //url the popup will redirect to when logged in
    },
    production: {
      network: 'kovan', //ethereum network to use for production
      redirectURL: 'https://mydomain.com/public/callback.html' //url the popup will redirect to when logged in
    }
  },
  networkIds: {
    kovan: 'kovan',
    rinkeby: 'rinkeby',
    live: 'mainnet',
    development: 'http://localhost:8545' //Update this if you use Ganache or another local blockchain
  }
};
