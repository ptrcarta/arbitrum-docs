import React from "react";
import { ethers } from 'ethers'
import VendingMachineContract from './VendingMachine.sol/VendingMachine.json'

export const VendingMachine = (props: { id: string, type: string }) => {

  class Web3VendingMachineClient {
    isWeb3 = true;
    defaultProviderUrl;
    identityLabel = "Ethereum address";

    // ensures that the context of this is always defined
    constructor(defaultProviderUrl = null) {
      this.giveCupcakeTo = this.giveCupcakeTo.bind(this);
      this.getCupcakeBalanceFor = this.getCupcakeBalanceFor.bind(this);
      this.requestAccount = this.requestAccount.bind(this);
      this.getWalletAddress = this.getWalletAddress.bind(this);
      this.initContract = this.initContract.bind(this);
      this.defaultProviderUrl = defaultProviderUrl;
    }

    async giveCupcakeTo(identity, vendingMachineContractAddress) {
      const contract = await this.initContract(vendingMachineContractAddress);
      const cupcakeCountBefore = Number(await contract.getCupcakeBalanceFor(identity));
      const transaction = await contract.giveCupcakeTo(identity);
      const receipt = await transaction.wait();
      const cupcakeCountAfter = Number(await contract.getCupcakeBalanceFor(identity));
      const succeeded = cupcakeCountAfter == cupcakeCountBefore + 1;
      return succeeded;
    }

    async getCupcakeBalanceFor(identity, vendingMachineContractAddress) {
      // console log everything in one line
      console.log(`getting cupcake balance for ${identity} on ${vendingMachineContractAddress}`);
      const contract = await this.initContract(vendingMachineContractAddress);
      const cupcakeBalance = await contract.getCupcakeBalanceFor(identity);
      return cupcakeBalance;
    }

    async requestAccount() {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
    }

    async getWalletAddress() {
      if (typeof window.ethereum !== 'undefined') {
        const signer = await this.initSigner();
        const walletAddress = await signer.getAddress();
        console.log(`wallet address: ${walletAddress}`);
        return walletAddress;
      }
    }

    async initSigner() {
      // we want to always use metamask to sign transactions
      // but we want to use the user-specified provider URL for reading / writing to the chain
      if (typeof window.ethereum !== 'undefined') {
        await this.requestAccount();
        const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = metamaskProvider.getSigner();
        return signer;
      }
    }

    async initContract(vendingMachineContractAddress) {
      if (typeof window.ethereum !== 'undefined') {
        const signer = await this.initSigner();
        const contract = new ethers.Contract(vendingMachineContractAddress, VendingMachineContract.abi, signer)
        return contract;
      }
    }
  }

  class Web2VendingMachineClient {
    isWeb3 = false;
    identityLabel = "Name";
    cupcakeBalances = {};
    cupcakeDistributionTimes = {};

    async giveCupcakeTo(identity) {
      if (this.cupcakeDistributionTimes[identity] === undefined) {
        this.cupcakeBalances[identity] = 0;
        this.cupcakeDistributionTimes[identity] = 0;
      }

      const fiveSeconds = 5000;
      const userCanReceiveCupcake = this.cupcakeDistributionTimes[identity] + fiveSeconds <= Date.now();
      if (userCanReceiveCupcake) {
        this.cupcakeBalances[identity]++;
        this.cupcakeDistributionTimes[identity] = Date.now();
        return true;
      } else {
        console.error("HTTP 429: Too Many Cupcakes (you must wait at least 5 seconds between cupcakes)");
        return false;
      }
    }

    async getCupcakeBalanceFor(identity) {
      let balance = this.cupcakeBalances[identity];
      if (balance === undefined)
        balance = 0;
      return balance;
    }
  }

  let vendingMachineClient;
  // todo: send this in from the consumer of this component
  switch (props.type) {
    case "web2":
      vendingMachineClient = new Web2VendingMachineClient();
      break;
    case "web3-localhost":
      vendingMachineClient = new Web3VendingMachineClient("http://localhost:8545");
      break;
    case "web3-arb-goerli":
      vendingMachineClient = new Web3VendingMachineClient("https://goerli-rollup.arbitrum.io/rpc");
      break;
    case "web3-arb-one":
      vendingMachineClient = new Web3VendingMachineClient("todo");
      break;
    case "web3-arb-nova":
      vendingMachineClient = new Web3VendingMachineClient("todo");
      break;
    default:
      throw new Error(`Error: unknown vending machine type ${props.type}`);
  }

  vendingMachineClient.domId = props.id;
  vendingMachineClient.getElementById = (id) => document.getElementById(vendingMachineClient.domId).querySelector(`#${id}`);

  const prefillWeb3Identity = async () => {
    const identityInput = vendingMachineClient.getElementById("identity-input");
    if (identityInput.value == "" || identityInput.value == null) {
      identityInput.value = await vendingMachineClient.getWalletAddress();
    }
  }

  const updateSuccessIndicator = (success) => {
    const errorIndicator = vendingMachineClient.getElementById("error-indicator");
    if (success) {
      console.log('should see green')
      errorIndicator.classList.remove("visible");
    }
    else {
      console.log('should see red')
      errorIndicator.classList.add("visible");
    }
  }

  const callWeb3VendingMachine = async (func) => {
    const identityInput = vendingMachineClient.getElementById("identity-input");
    const identity = identityInput.value;
    const contractAddressInput = vendingMachineClient.getElementById("contract-address-input");
    const contractAddress = contractAddressInput.value;
    // console log everything in one line
    console.log(`calling ${func.name} with ${identity} on ${contractAddress}`);
    return await func(identity, contractAddress);
  }

  const handleCupcakePlease = async () => {
    try {
      const identityInput = vendingMachineClient.getElementById("identity-input");
      const identity = identityInput.value;

      let gotCupcake;
      if (vendingMachineClient.isWeb3) {
        await prefillWeb3Identity();
        gotCupcake = await callWeb3VendingMachine(vendingMachineClient.giveCupcakeTo);
      } else {
        gotCupcake = await vendingMachineClient.giveCupcakeTo(identity);
      }

      let existingFadeout;
      if (gotCupcake) {
        const cupcake = vendingMachineClient.getElementById("cupcake");
        cupcake.style.opacity = 1;
        cupcake.style.transition = "unset";
        clearTimeout(existingFadeout);

        existingFadeout = setTimeout(() => {
          cupcake.style.transition = "opacity 5.5s";
          cupcake.style.opacity = 0;
        }, 0);

        setTimeout(() => {
          cupcake.style.transition = "opacity 0s";
          cupcake.style.opacity = 0;
        }, 5000);

        await handleRefreshBalance();
      } else if (gotCupcake === false) {
        alert("HTTP 429: Too Many Cupcakes (you must wait at least 5 seconds between cupcakes)");
      }
      updateSuccessIndicator(true);
    } catch (err) {
      console.error("ERROR: handleCupcakePlease: " + err);
      updateSuccessIndicator(false);
    }
  };

  const handleRefreshBalance = async () => {
    try {
      const identityInputEl = vendingMachineClient.getElementById("identity-input");
      let identityFromInput = identityInputEl.value;
      let identityToDisplay;
      const cupcakeCountEl = vendingMachineClient.getElementById("cupcake-balance");
      let balanceToDisplay;

      if (vendingMachineClient.isWeb3) {
        await prefillWeb3Identity();
        balanceToDisplay = await callWeb3VendingMachine(vendingMachineClient.getCupcakeBalanceFor);
        identityFromInput = identityInputEl.value;
        identityToDisplay = identityFromInput.truncateAddress();
      } else {
        identityToDisplay = identityFromInput;
        if (identityToDisplay == null || identityToDisplay == "")
          identityToDisplay = "no name";
        balanceToDisplay = await vendingMachineClient.getCupcakeBalanceFor(identityFromInput);
      }

      cupcakeCountEl.textContent = `${balanceToDisplay} (${identityToDisplay})`
      updateSuccessIndicator(true);
    } catch (err) {
      console.error("ERROR: handleRefreshBalance: " + err);
      updateSuccessIndicator(false);
    }
  };

  String.prototype.truncateAddress = function () {
    return this.slice(0, 5) + "..." + this.slice(-3);
  };

  return (
    <div className='vending-machine' id={vendingMachineClient.domId}>
      <h4>Free Cupcakes</h4>
      <span className='subheader'>{props.type}</span>
      <label>{vendingMachineClient.identityLabel}</label>
      <input id="identity-input" type="text" placeholder={"Enter " + vendingMachineClient.identityLabel.toLowerCase()} />
      <label className={vendingMachineClient.isWeb3 ? '' : 'hidden'}>Contract address</label>
      <input id="contract-address-input" type="text" placeholder="Enter contract address" className={vendingMachineClient.isWeb3 ? '' : 'hidden'} />
      <button id="cupcake-please" onClick={handleCupcakePlease}>Cupcake please!</button>
      <a id="refresh-balance" onClick={handleRefreshBalance}>Refresh balance</a>
      <span id="cupcake" style={{ opacity: 0 }}> 🧁</span>
      <p id='balance-wrapper'>
        <span>Cupcake balance:</span>
        <span id="cupcake-balance">0</span>
      </p>
      <span id="success-indicator"></span>
      <span id="error-indicator"></span>
    </div>
  );
};