// Simple example app that demonstrates sign in, sign out, using web3,
// and initializing contracts from truffle.

import { AuthenticationStatus, Bitski } from "bitski";
import { Contract as ethersContract, providers, utils } from "ethers";
import { Zero } from "ethers/constants";
import { bigNumberify, randomBytes } from "ethers/utils";
import Web3 from "web3";
import disputeManagerArtifact from "../build/contracts/DisputeManager.json";
// Import any contracts you want to use from the build folder.
// Here we've imported the sample contract.
import myContractArtifacts from "../build/contracts/MyContract.json";
import Contract from "./contract";
import { getHash } from "./hash";

const order = {
  marketHash:
    "0x7c828cd884a382728541f88682085020f3b672088fa04abd1892568aa409d29f",
  totalBetSize: bigNumberify("750000000000000000000"),
  percentageOdds: bigNumberify("29333333333333333333"),
  expiry: 1553648700,
  oracleFee: bigNumberify("2000000000000000000"),
  relayer: "0x0000000000000000000000000000000000000000",
  relayerMakerFee: Zero,
  relayerTakerFee: Zero,
  salt: bigNumberify(randomBytes(32)),
  isMakerBetingOutcomeOne: false,
  maker: "0xaD90d89b23Fc80bCF70c3E8CC23a21ccADFBC95F"
};

export default class App {
  /**
   * Creates the app.
   */
  constructor() {
    // Initialize bitski and web3
    this.bitski = new Bitski(BITSKI_CLIENT_ID, BITSKI_REDIRECT_URL);
    this.web3 = new Web3(this.bitski.getProvider(BITSKI_PROVIDER_ID));
    this.bitskiEthersWeb3Provider = new providers.Web3Provider(
      this.web3.currentProvider
    );
    this.bitskiEthersWeb3Provider.on('debug', (info) => {
      console.log(info.action);
      console.log(info.request);
      console.log(info.response);
      console.log(info.provider);
    })
    // Initialize the sample contract
    this.contract = new Contract(this.web3, myContractArtifacts);
    this.disputeManagerContract = new Contract(
      this.web3,
      disputeManagerArtifact
    );
  }

  /**
   * Starts the application.
   */
  start() {
    // Setup the interface
    this.configureView();
    this.checkLoggedInStatus();
  }

  /**
   * One-time setup of the interface.
   */
  configureView() {
    // Store various UI elements
    this.loadingContainer = document.getElementById("loading");
    this.signedInContainer = document.getElementById("signed-in");
    this.signedOutContainer = document.getElementById("signed-out");
    this.walletAddressContainer = document.getElementById("wallet-address");
    this.errorContainer = document.getElementById("error");
    this.signPayloadMetamaskElement = document.getElementById(
      "sign-payload-metamask"
    );
    this.signPayloadBitskiElement = document.getElementById(
      "sign-payload-bitski"
    );
    this.signHelloBitskiArraifyElement = document.getElementById(
      "sign-hello-bitski-arrayify"
    );
    this.signHelloBitskiNonArrayifyElement = document.getElementById(
      "sign-hello-bitski-nonarrayify"
    );
    this.signHelloMetamaskElement = document.getElementById(
      "sign-hello-metamask"
    );
    this.disputeManagerErrorElement = document.getElementById(
      "dispute-manager-error"
    );
    this.signPayloadMetamaskElement.addEventListener("click", event => {
      event.preventDefault();
      this.signPayloadMetamask();
    });
    this.disputeManagerErrorElement.addEventListener("click", event => {
      event.preventDefault();
      this.disputeManagerError()
    });
    this.signPayloadBitskiElement.addEventListener("click", event => {
      event.preventDefault();
      this.signPayloadBitski();
    });
    this.signHelloBitskiArraifyElement.addEventListener("click", event => {
      event.preventDefault();
      this.signHelloBitskiArrayify();
    });
    this.signHelloBitskiNonArrayifyElement.addEventListener("click", event => {
      event.preventDefault();
      this.signHelloBitskiNonArrayify();
    });
    this.signHelloMetamaskElement.addEventListener("click", event => {
      event.preventDefault();
      this.signHelloMetamask();
    });

    // Set up connect button
    const connectElement = document.getElementById("connect-button");
    this.connectButton = this.bitski.getConnectButton(
      { container: connectElement },
      error => {
        if (error) {
          this.setError(error);
        } else {
          this.continueToApp();
        }
      }
    );

    // Set up log out button
    this.logOutButton = document.getElementById("log-out");
    this.logOutButton.addEventListener("click", event => {
      event.preventDefault();
      this.signOut();
    });
  }

  signPayloadMetamask() {
    window.ethereum.enable().then(() => {
      const provider = new providers.Web3Provider(window.web3.currentProvider);
      const signer = provider.getSigner();
      signer.getAddress().then(address => {
        let makerOrder = Object.assign({}, order);
        console.log(`Signing hash of order`);
        console.log(makerOrder);
        const orderHash = getHash(makerOrder);
        console.log(`Metamask order hash to sign: ${orderHash}`);
        signer.provider
          .send("personal_sign", [address.toLowerCase(), orderHash])
          .then(signature => {
            console.log(`Metamask signature: ${signature}`);
            this.myContractEthersWrapper
              .computeRecoveryAddress(orderHash, signature)
              .then(address => {
                console.log(`Recovered metamask address: ${address}`);
              });
          });
      });
    });
  }

  disputeManagerError() {
    this.myContractEthersWrapper.getEnum().then(result => console.log(result));
    // this.disputeManagerWrapper
    //   .getMarketResult(
    //     "0xf845bde8cc4101ea1456985e2fb87a4fe10d351f3c5aa53e5863396d6253f596"
    //   )
    //   .then(result => console.log(result));
  }

  signPayloadBitski() {
    const bitskiSigner = this.bitskiEthersWeb3Provider.getSigner();
    bitskiSigner.getAddress().then(address => {
      let makerOrder = Object.assign({}, order);
      console.log(`Signing hash of order`);
      console.log(makerOrder);
      const orderHash = getHash(makerOrder);
      console.log(`Bitski hash to sign: ${orderHash}`);
      bitskiSigner.provider
        .send("eth_sign", [address.toLowerCase(), orderHash])
        .then(signature => {
          console.log(`Bitski signature: ${signature}`);
          this.myContractEthersWrapper
            .computeRecoveryAddress(orderHash, signature)
            .then(address => {
              console.log(`Recovered bitski address: ${address}`);
            });
        });
    });
  }

  signHelloBitskiArrayify() {
    console.log("signHelloBitskiArrayify");
    const bitskiSigner = this.bitskiEthersWeb3Provider.getSigner();
    bitskiSigner.getAddress().then(address => {
      const hash = utils.arrayify(utils.formatBytes32String("hello"));
      console.log(`Bitski hash to sign: ${hash}`);
      bitskiSigner.provider
        .send("eth_sign", [address.toLowerCase(), hash])
        .then(signature => {
          console.log(`Bitski signature: ${signature}`);
          this.myContractEthersWrapper
            .computeRecoveryAddress(hash, signature)
            .then(address => {
              console.log(`Recovered bitski address: ${address}`);
            });
        });
    });
  }

  signHelloBitskiNonArrayify() {
    console.log("signHelloBitskiNonArrayify");
    const bitskiSigner = this.bitskiEthersWeb3Provider.getSigner();
    bitskiSigner.getAddress().then(address => {
      const hash = utils.formatBytes32String("hello");
      console.log(`Bitski hash to sign: ${hash}`);
      bitskiSigner.signMessage(hash).then(signature => {
        console.log(`Bitski signature: ${signature}`);
        this.myContractEthersWrapper
          .computeRecoveryAddress(hash, signature)
          .then(address => {
            console.log(`Recovered bitski address: ${address}`);
          });
      });
    });
  }

  signHelloMetamask() {
    window.ethereum.enable().then(() => {
      const provider = new providers.Web3Provider(window.web3.currentProvider);
      const signer = provider.getSigner();
      signer.getAddress().then(address => {
        const hash = utils.formatBytes32String("hello");
        console.log(`Metamask hash to sign: ${hash}`);
        signer.signMessage(hash).then(signature => {
          console.log(`Metamask signature: ${signature}`);
          this.myContractEthersWrapper
            .computeRecoveryAddress(hash, signature)
            .then(address => {
              console.log(`Recovered metamask address: ${address}`);
            });
        });
      });
    });
  }

  /**
   * Checks whether or not the user is currently logged in to Bitski.
   */
  checkLoggedInStatus() {
    this.bitski
      .getAuthStatus()
      .then(authStatus => {
        this.toggleLoading(false);
        if (authStatus == AuthenticationStatus.Connected) {
          this.continueToApp();
        } else {
          this.showLoginButton();
        }
      })
      .catch(error => {
        this.toggleLoading(false);
        this.setError(error);
        this.showLoginButton();
      });
  }

  /**
   * Toggles the loading state
   * @param {boolean} show whether or not to show the loading state
   */
  toggleLoading(show) {
    this.loadingContainer.style.display = show === true ? "block" : "none";
  }

  /**
   * Initializes the contract and shows the app UI
   */
  continueToApp() {
    //Set up the contract
    this.contract
      .deployed()
      .then(instance => {
        this.contractInstance = instance;
        this.myContractEthersWrapper = new ethersContract(
          instance.options.address,
          myContractArtifacts.abi,
          this.bitskiEthersWeb3Provider
        );
        this.disputeManagerContract.deployed().then(instance => {
          this.disputeManagerInstance = instance;
          this.disputeManagerWrapper = new ethersContract(
            instnace.options.address,
            disputeManagerArtifact.abi,
            this.bitskiEthersWeb3Provider
          );
          this.showApp()
        })
      })
      .catch(error => {
        this.setError(error);
      });
  }

  /**
   * Configure the UI to show or hide an error
   * @param {error | null} error error to show in the UI, or null to clear.
   */
  setError(error) {
    if (error) {
      this.errorContainer.innerHTML = error;
      console.error(error);
    } else {
      this.errorContainer.innerHTML = "";
    }
  }

  /**
   * Show the main app (logged in) UI
   */
  showApp() {
    this.signedOutContainer.style.display = "none";
    this.signedInContainer.style.display = "block";
    // From this point, you should be able to interact with web3 and contractInstance
    this.web3.eth
      .getAccounts()
      .then(accounts => {
        this.currentAccount = accounts[0];
        if (accounts[0]) {
          this.walletAddressContainer.innerHTML = accounts[0];
        } else {
          console.log("no address found");
        }
      })
      .catch(error => {
        this.setError(error);
      });
  }

  /**
   * Show the logged out UI
   */
  showLoginButton() {
    this.signedOutContainer.style.display = "block";
    this.signedInContainer.style.display = "none";
  }

  /**
   * Signs the current user out of Bitski and updates the UI.
   */
  signOut() {
    this.bitski
      .signOut()
      .then(() => {
        this.contractInstance = null;
        this.showLoginButton();
      })
      .catch(err => {
        this.setError(err);
      });
  }
}
