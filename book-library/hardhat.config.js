require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-testnets", "Deploys contract on a provided network")
  .addOptionalParam("verifycontract", "Verify contract on Etherscan", false, types.boolean)
  .setAction(async (taskArguments, hre, runSuper) => {
    const deployLibraryContract = require("./scripts/deploy");
    await deployLibraryContract(taskArguments);
  });

task("deploy-mainnet", "Deploys contract on a provided network")
  .addParam("privateKey", "Please provide the private key")
  .setAction(async ({privateKey}) => {
    const deployLibraryContract = require("./scripts/deploy-with-param");
    await deployLibraryContract(privateKey);
  });

task("interact-testnet", "Interact with Library contract on testnet")
  .addParam("contractNetwork", "Please provide the network name")
  .addParam("contractAddress", "Please provide the contract address")
  .setAction(async ({contractNetwork, contractAddress}) => {
    const interactNetwork = require("./scripts/interact-network");
    await interactNetwork(contractNetwork, contractAddress);
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};
