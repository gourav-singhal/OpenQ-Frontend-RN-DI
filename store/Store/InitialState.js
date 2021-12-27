import Utils from '../../services/utils/Utils';

import OpenQClient from '../../services/ethers/OpenQClient';
import OpenQSubgraphClient from '../../services/subgraph/OpenQSubgraphClient';
import GithubRepository from '../../services/github/GithubRepository';
import TokenClient from '../../services/coins/TokenClient';

import MockGithubRepository from '../../services/github/MockGithubRepository';
import MockOpenQClient from '../../services/ethers/MockOpenQClient';
import MockOpenQSubgraphClient from '../../services/subgraph/MockOpenQSubgraphClient';
import MockTokenClient from '../../services/coins/MockTokenClient';

// Token Metadata
import mumbaiTokenMetadata from '../../constants/polygon-mumbai.json';
import polygonMainnetTokenMetadata from '../../constants/polygon-mainnet.json';
import mumbaiTokens from '../../constants/polygon-mumbai-tokens.json';
import polygonMainnetTokens from '../../constants/polygon-mainnet-tokens.json';

let InitialState = {};
switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
case 'local':
	InitialState = {
		tokenMetadata: mumbaiTokenMetadata,
		tokens: mumbaiTokens,
		openQClient: new MockOpenQClient(),
		githubRepository: new MockGithubRepository(),
		openQSubgraphClient: new MockOpenQSubgraphClient(),
		tokenClient: new MockTokenClient(),
		utils: new Utils(),
	};
	break;
case 'docker':
	InitialState = {
		tokenMetadata: mumbaiTokenMetadata,
		tokens: mumbaiTokens,
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		utils: new Utils(),
	};
	break;
case 'development':
	InitialState = {
		tokenMetadata: mumbaiTokenMetadata,
		tokens: mumbaiTokens,
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		utils: new Utils(),
	};
	break;
case 'staging':
	InitialState = {
		tokenMetadata: polygonMainnetTokenMetadata,
		tokens: polygonMainnetTokens,
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		openQSubgraphClient: new OpenQSubgraphClient(),
		tokenClient: new TokenClient(),
		utils: new Utils(),
	};
	break;
case 'production':
	InitialState = {
		tokenMetadata: polygonMainnetTokenMetadata,
		tokens: polygonMainnetTokens,
		openQClient: new OpenQClient(),
		githubRepository: new GithubRepository(),
		tokenClient: new TokenClient(),
		utils: new Utils(),
	};
	break;
default:
	throw Error('ENVIRONMENT NOT CONFIGURED CORRECTLY. Set an environment with DEPLOY_ENV');
}

export default InitialState;