require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-testnets", "Deploys contract on a provided network")
  .addParam("contractName", "The contract name to be deployed")
  .addOptionalParam("verifycontract", "Verify contract on Etherscan", false, types.boolean)
  .setAction(async ({contractName, verifycontract}, hre, runSuper) => {
    const deployContract = require("./scripts/deploy");
    await deployContract(contractName, verifycontract);
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
};