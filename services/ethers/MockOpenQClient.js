/* eslint-disable */
// import { issueIds } from './mocks/data/issueIds';
import axios from 'axios';
import {ethers} from 'ethers';

class MockOpenQClient {
	shouldSleep = 0;

	setSleep(time) {
		this.shouldSleep = time;
	}

	constructor() { }

	async sleep(time) {
		return new Promise(async (resolve, reject) => {
			setTimeout(time),
				resolve();
		});
	}

	async getENS(_callerAddress){
		let promise = new Promise (async (resolve) =>{
			await this.sleep(1500);
			resolve("sample.eth");
			
		})
		return promise
	}

	async getAllIssues(library) {
		await sleep();

		return axios.get(`http://localhost:3030/getAllIssues`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueAddresses(library, issues) {
		return axios.get(`http://localhost:3030/getIssueAddresses`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueIsOpen(library, issueId) {
		return true;
	}

	async getIssueIdFromAddress(library, address) {
		return axios.get(`http://localhost:3030/getIssueIdFromAddress/${address}`)
			.then(result => {
				return result.data.issueId;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async mintBounty(library, issueId, organization) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep(1500);
			resolve({ "bountyAddress": "0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e", "txnReceipt": {} });
		});
		return promise;
	}

	async fundBounty(library, _bountyId, _tokenAddress, _value, _depositPeriodDays) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep(4500);

				resolve(({ "bountyAddress": "0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e", "txnReceipt": {} }));
		});
		return promise;
	}

	async balanceOf(library, _callerAddress, _tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
				resolve(ethers.BigNumber.from("6600000000000000000"));
		});
		return promise;
	}

	async approve(library, _bountyAddress, _tokenAddress, _value) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				resolve({});
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
		let promise = new Promise(async (resolve) => {
				this.sleep(1500);
				resolve(true);

		});

		return promise;
	}
}

export default MockOpenQClient;