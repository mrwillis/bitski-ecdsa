module.exports = {
  app: {
    id: "41df0fa7-7813-4e2f-9f6a-63b2bddaccf1" //change this to your app's client id
  },
  appWallet: {
    client: {
      //if you have an app wallet, add your client id and secret here
      id: "id",
      secret: "secret"
    },
    auth: {
      tokenHost: "https://account.bitski.com",
      tokenPath: "/oauth2/token"
    }
  },
  environments: {
    development: {
      network: "development", //ethereum network to use for local dev
      redirectURL: "http://localhost:3000/public/callback.html" //url the popup will redirect to when logged in
    },
    production: {
      network: "rinkeby", //ethereum network to use for production
      redirectURL: "https://bitski-ecdsa.herokuapp.com/public/callback.html" //url the popup will redirect to when logged in
    },
    rinkeby: {
      network: "rinkeby",
      redirectURL: "https://bitski-ecdsa.herokuapp.com/callback.html"
    }
  },
  networkIds: {
    kovan: "kovan",
    rinkeby: "rinkeby",
    live: "mainnet",
    development: "http://localhost:8545" //Update this if you use Ganache or another local blockchain
  }
};
