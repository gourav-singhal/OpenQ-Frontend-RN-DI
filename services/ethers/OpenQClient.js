import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ/Implementations/OpenQV1.sol/OpenQV1.json';
import DepositManagerABI from '../../artifacts/contracts/DepositManager/DepositManager.sol/DepositManager.json';
import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import jsonRpcErrors from './JsonRPCErrors';

class OpenQClient {
  constructor() {}

  /**
   *
   * @param {Web3Provider} signer An ethers.js signer
   * @returns Web3Contract
   */
  OpenQ = (signer) => {
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS, OpenQABI.abi, signer);
    return contract;
  };

  /**
   *
   * @param {Web3Provider} signer An ethers.js signer
   * @returns Web3Contract
   */
  DepositManager = (signer) => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS,
      DepositManagerABI.abi,
      signer
    );
    return contract;
  };

  /**
   *
   * @param {string} tokenAddress Contract address of an ERC20 token
   * @param {Web3Provider} signer An ethers.js signer
   * @returns Web3Contract
   */

  ERC20 = (tokenAddress, signer) => {
    const contract = new ethers.Contract(tokenAddress, ERC20ABI.abi, signer);
    return contract;
  };

  signMessage = async (account) => {
    const message = 'OpenQ';
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    });
    return signature;
  };

  async mintBounty(library, issueId, organization, type, data) {
    const promise = new Promise(async (resolve, reject) => {
      let bountyInitOperation;
      let abiCoder = new ethers.utils.AbiCoder();
      const fundVolumeInWei = data.fundingTokenVolume * 10 ** data.fundingTokenAddress.decimals;
      const fundBigNumberVolumeInWei = ethers.BigNumber.from(
        fundVolumeInWei.toLocaleString('fullwide', { useGrouping: false })
      );
      const hasFundingGoal = fundVolumeInWei > 0;
      switch (type) {
        case 'Fixed Price':
          {
            const fundingGoalBountyParams = abiCoder.encode(
              ['bool', 'address', 'uint256'],
              [hasFundingGoal, data.fundingTokenAddress.address, fundBigNumberVolumeInWei]
            );
            bountyInitOperation = [0, fundingGoalBountyParams];
          }
          break;
        case 'Split Price':
          {
            const payoutVolumeInWei = data.payoutVolume * 10 ** data.payoutToken.decimals;
            const payoutBigNumberVolumeInWei = ethers.BigNumber.from(
              payoutVolumeInWei.toLocaleString('fullwide', {
                useGrouping: false,
              })
            );
            const ongoingAbiEncodedParams = abiCoder.encode(
              ['address', 'uint256', 'bool', 'address', 'uint256'],
              [
                data.payoutToken.address,
                payoutBigNumberVolumeInWei,
                hasFundingGoal,
                data.fundingTokenAddress.address,
                fundBigNumberVolumeInWei,
              ]
            );
            bountyInitOperation = [1, ongoingAbiEncodedParams];
          }
          break;
        case 'Contest':
          {
            const tieredAbiEncodedParams = abiCoder.encode(
              ['uint256[]', 'bool', 'address', 'uint256'],
              [data.tiers, hasFundingGoal, data.fundingTokenAddress.address, fundBigNumberVolumeInWei]
            );
            bountyInitOperation = [2, tieredAbiEncodedParams];
          }
          break;
        case 'Fixed Contest':
          {
            const tieredAbiEncodedParams = abiCoder.encode(
              ['uint256[]', 'address'],
              [data.tiers, data.payoutToken.address]
            );
            bountyInitOperation = [3, tieredAbiEncodedParams];
          }
          break;
        default:
          throw new Error('Unknown Bounty Type');
      }

      const signer = library.getSigner();

      const contract = this.OpenQ(signer);
      try {
        const txnResponse = await contract.mintBounty(issueId, organization, bountyInitOperation);
        const txnReceipt = await txnResponse.wait();
        const bountyAddress = txnReceipt.events.find((eventObj) => eventObj.event === 'BountyCreated').args
          .bountyAddress;
        resolve({ bountyAddress, txnReceipt });
      } catch (err) {
        reject('err', err);
        reject(err);
      }
    });
    return promise;
  }

  // setFunding inspired by fundBounty
  async setFundingGoal(library, _bountyId, _fundingGoalToken, _fundingGoalVolume) {
    const promise = new Promise(async (resolve, reject) => {
      const volumeInWei = _fundingGoalVolume * 10 ** _fundingGoalToken.decimals;
      const bigNumberVolumeInWei = ethers.BigNumber.from(
        volumeInWei.toLocaleString('fullwide', { useGrouping: false })
      );
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setFundingGoal(_bountyId, _fundingGoalToken.address, bigNumberVolumeInWei);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async setPayout(library, _bountyId, _payoutToken, _payoutVolume) {
    const promise = new Promise(async (resolve, reject) => {
      const volumeInWei = _payoutVolume * 10 ** _payoutToken.decimals;
      const bigNumberVolumeInWei = ethers.BigNumber.from(
        volumeInWei.toLocaleString('fullwide', { useGrouping: false })
      );
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setPayout(_bountyId, _payoutToken.address, bigNumberVolumeInWei);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async setPayoutSchedule(library, _bountyId, _payoutSchedule) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setPayoutSchedule(_bountyId, _payoutSchedule);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async approve(library, _bountyAddress, _tokenAddress, _value) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.ERC20(_tokenAddress, signer);
      try {
        const txnResponse = await contract.approve(_bountyAddress, _value);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async allowance(library, _tokenAddress) {
    const promise = new Promise(async (resolve) => {
      try {
        const signer = library.getSigner();
        const contract = this.ERC20(_tokenAddress, signer);
        const allowance = await contract.allowance(
          '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'
        );
        resolve(allowance);
      } catch (err) {
        resolve({ _hex: '0x00', _isBigNumber: true });
      }
    });
    return promise;
  }

  async balanceOf(library, _callerAddress, _tokenAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library?.getSigner();
      if (!signer) {
        resolve({ noSigner: true });
      }
      const contract = this.ERC20(_tokenAddress, signer);
      try {
        let volume;
        if (_tokenAddress == ethers.constants.AddressZero) {
          volume = await library.getBalance(_callerAddress);
        } else {
          volume = await contract.balanceOf(_callerAddress);
        }
        resolve(volume);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async userOwnedTokenBalances(library, _callerAddress, tokens) {
    const promise = new Promise(async (resolve) => {
      const tokensInWallet = [];
      tokens.forEach(async (token) => {
        tokensInWallet.push(this.userBalanceForToken(library, token, _callerAddress));
      });
      resolve(Promise.all(tokensInWallet));
    });

    return promise;
  }

  async userBalanceForToken(library, token, _callerAddress) {
    const signer = library.getSigner();
    const zero = ethers.BigNumber.from(0);

    let promise = new Promise(async (resolve) => {
      let bigNumber;
      let balance;

      try {
        if (token.address == ethers.constants.AddressZero) {
          balance = await library.getBalance(_callerAddress);
        } else {
          const contract = this.ERC20(token.address, signer);
          balance = await contract.balanceOf(_callerAddress);
        }

        bigNumber = ethers.BigNumber.from(balance);
        resolve(!bigNumber.eq(zero));
      } catch (error) {
        resolve(false);
      }
    });

    return promise;
  }

  async getENS(_callerAddress) {
    let promise = new Promise(async (resolve) => {
      let ensName;
      try {
        let provider = new ethers.providers.InfuraProvider('homestead', process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
        let name = await provider.lookupAddress(_callerAddress);
        let reverseAddress = ethers.utils.getAddress(await provider.resolveName(name));
        // we need to check if their address is reverse registered
        if (ethers.utils.getAddress(_callerAddress) === reverseAddress) {
          ensName = name;
        }
        resolve(ensName);
      } catch (error) {
        resolve(false);
      }
    });
    return promise;
  }

  async fundBounty(library, _bountyAddress, _tokenAddress, _value, _depositPeriodDays) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.DepositManager(signer);
      try {
        const expiration = _depositPeriodDays * 24 * 60 * 60;

        let txnResponse;
        let txnReceipt;

        if (_tokenAddress == ethers.constants.AddressZero) {
          txnResponse = await contract.fundBountyToken(_bountyAddress, _tokenAddress, _value, expiration, {
            value: _value,
          });
        } else {
          txnResponse = await contract.fundBountyToken(_bountyAddress, _tokenAddress, _value, expiration);
        }
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async closeCompetition(library, _bountyId) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.OpenQ(signer);
      try {
        let txnResponse = await contract.closeCompetition(_bountyId);
        let txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async closeOngoing(library, _bountyId) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.OpenQ(signer);
      try {
        let txnResponse = await contract.closeOngoing(_bountyId);
        let txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async extendDeposit(library, _bountyAddress, _depositId, _depositPeriodDays) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const seconds = _depositPeriodDays * 24 * 60 * 60;
        const txnResponse = await contract.extendDeposit(_bountyAddress, _depositId, seconds);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async refundDeposit(library, _bountyAddress, _depositId) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const txnResponse = await contract.refundDeposit(_bountyAddress, _depositId);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async tokenAddressLimitReached(library, _bountyAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const tokenAddressLimitReached = await contract.tokenAddressLimitReached(_bountyAddress);
        resolve(tokenAddressLimitReached);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async isWhitelisted(library, tokenAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const isWhitelisted = await contract.isWhitelisted(tokenAddress);
        resolve(isWhitelisted);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  handleError(jsonRpcError, data) {
    let errorString = jsonRpcError?.data?.message;

    // Data messages - more specific than jsonRpcError.message
    if (errorString) {
      for (const error of jsonRpcErrors) {
        const revertString = Object.keys(error)[0];
        if (errorString.includes(revertString)) {
          const title = error[revertString]['title'];
          const message = error[revertString].message(data);
          const link = error[revertString].link;
          const linkText = error[revertString].linkText;
          return { title, message, link, linkText };
        }
      }
    }

    let miscError;
    if (typeof jsonRpcError === 'string') {
      if (jsonRpcError.includes('Ambire user rejected the request')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.includes('Rejected Request')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.includes('Transaction was rejected')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
    }

    if (jsonRpcError.message) {
      if (jsonRpcError.message.includes('Nonce too high.')) {
        miscError = 'NONCE_TO_HIGH';
      }
      if (jsonRpcError.message.includes('User denied transaction signature')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.message.includes('Transaction was rejected')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.message.includes('MetaMask is having trouble connecting to the network')) {
        miscError = 'METAMASK_HAVING_TROUBLE';
      }
      if (jsonRpcError.message.includes('Internal JSON-RPC error')) {
        miscError = 'INTERNAL_ERROR';
      }
      if (jsonRpcError.message.includes('Set a higher gas fee')) {
        miscError = 'UNDERPRICED_TXN';
      }
      if (jsonRpcError.message.includes('CFA: flow does not exist')) {
        miscError = 'CFA_DOES_NOT_EXIST';
      }
      if (jsonRpcError.message.includes('CFA: flow already exist')) {
        miscError = 'CFA_EXISTS';
      }
      if (jsonRpcError.message.includes('COMPETITION_ALREADY_CLOSED')) {
        miscError = 'COMPETITION_ALREADY_CLOSED';
      }
      if (jsonRpcError.message.includes('ONGOING_BOUNTY_ALREADY_CLOSED')) {
        miscError = 'ONGOING_BOUNTY_ALREADY_CLOSED';
      }
    }

    if (!miscError) {
      errorString = 'CALL_EXCEPTION';
      miscError = 'CALL_EXCEPTION';
    }

    for (const error of jsonRpcErrors) {
      const revertString = Object.keys(error)[0];
      if (miscError.includes(revertString)) {
        const title = error[revertString]['title'];
        const message = error[revertString].message(data);
        const link = error[revertString].link;
        const linkText = error[revertString].linkText;
        return { title, message, link, linkText };
      }
    }

    return 'Unknown Error';
  }
}

export default OpenQClient;
