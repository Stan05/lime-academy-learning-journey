require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy-localhost", "Deploys on the localhost", async (taskArgs, hre) => {
  const ETHWrapperFactory = await ethers.getContractFactory("ETHWrapper"); // 
  const ETHWrapperContract = await ETHWrapperFactory.deploy();
  await ETHWrapperContract.deployed();
  

  const WETHFactory = await hre.ethers.getContractFactory("WETH");
  const wethAddress = await ETHWrapperContract.WETHToken();
  console.log(wethAddress);
  const WETHContract = await WETHFactory.attach(wethAddress)


  const localProvider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545');
  const wallet = new hre.ethers.Wallet("0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0", localProvider);
  
  console.log("Contract ETH balance before wrapping:", (await localProvider.getBalance(ETHWrapperContract.address)).toString());
  
  const wrapValue = hre.ethers.utils.parseEther("1");
  const tx = await ETHWrapperContract.connect(wallet).wrap({value: wrapValue});
	await tx.wait();
  
  console.log("Contract ETH balance before wrapping:", (await localProvider.getBalance(ETHWrapperContract.address)).toString());

  const approveTx = await WETHContract.connect(wallet).approve(ETHWrapperContract.address, wrapValue)
	await approveTx.wait()

	console.log("Balance before unwrapping:", (await WETHContract.balanceOf(wallet.address)).toString());

	const unwrapTx = await ETHWrapperContract.connect(wallet).unwrap(wrapValue)
	await unwrapTx.wait()

	console.log("Balance after unwrapping:", (await WETHContract.balanceOf(wallet.address)).toString());

  console.log("Contract ETH balance after unwrapping:", (await localProvider.getBalance(ETHWrapperContract.address)).toString());
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
};
