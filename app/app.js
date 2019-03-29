// Simple example app that demonstrates sign in, sign out, using web3,
// and initializing contracts from truffle.

import { AuthenticationStatus, Bitski } from "bitski";
import { Contract as ethersContract, providers, utils } from "ethers";
import Web3 from "web3";
// Import any contracts you want to use from the build folder.
// Here we've imported the sample contract.
import artifacts from "../build/contracts/MyContractRinkeby.json";
import Contract from "./contract";

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
    // Initialize the sample contract
    this.contract = new Contract(this.web3, artifacts);
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

    this.signPayloadMetamaskElement.addEventListener("click", event => {
      event.preventDefault();
      this.signPayloadMetamask();
    });

    this.signPayloadBitskiElement.addEventListener("click", event => {
      event.preventDefault();
      this.signPayloadBitski();
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
      const hash = utils.formatBytes32String("hello");
      signer.getAddress().then(address => {
        signer.provider
          .send("personal_sign", [hash, address])
          .then(signature => {
            console.log(`Metamask signature: ${signature}`);
            this.myContractEthersWrapper
              .computeRecoveryAddress(hash, signature)
              .then(address => {
                console.log(`Recovered metamask address: ${address}`);
              });
          });
      });
    });
    // this.web3.eth.getAccounts().then((accounts) => {
    //   console.log(this.ethersWeb3Provider)
    //   this.ethersWeb3Provider.getSigner(accounts[0]).then((signer) => {
    //     console.log(signer)
    //   });
    // })
  }

  signPayloadBitski() {
    const bitskiSigner = this.bitskiEthersWeb3Provider.getSigner();
    const hash = utils.arrayify(utils.formatBytes32String("hello"));
    console.log(`Bitski hash to sign: ${hash}`);
    bitskiSigner.getAddress().then(address => {
      // bitskiSigner.provider.send("personal_sign", [hash, address]).then(signature => {
      //   console.log(`Bitski signature: ${signature}`);
      //   this.myContractEthersWrapper
      //     .computeRecoveryAddress(hash, signature)
      //     .then(address => {
      //       console.log(`Recovered bitski address: ${address}`);
      //     });
      // })
      bitskiSigner.signMessage(hash).then(signature => {
        console.log(utils.splitSignature(signature));
        console.log(`Bitski signature: ${signature}`);
        this.myContractEthersWrapper
          .computeRecoveryAddress(hash, signature)
          .then(address => {
            console.log(`Recovered bitski address: ${address}`);
          });
      });
    });
    // bitskiSigner.signMessage(hash).then(signature => {
    //   console.log(`Bitski signature: ${signature}`);
    //   this.myContractEthersWrapper
    //     .computeRecoveryAddress(hash, signature)
    //     .then(address => {
    //       console.log(`Recovered bitski address: ${address}`);
    //     });
    // });
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
          artifacts.abi,
          this.bitskiEthersWeb3Provider
        );
        // Show the app UI
        this.showApp();
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
