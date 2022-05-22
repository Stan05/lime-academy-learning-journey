const hre = require("hardhat");

async function main() {
    const ETHWrapperFactory = await hre.ethers.getContractFactory("ETHWrapper");
    const ethWrapperConrtact = await ETHWrapperFactory.attach("0x59b670e9fA9D0A427751Af201D676719a970857b");

    const localProvider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545');
    const wallet = new hre.ethers.Wallet("0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0", localProvider);

    const WETHFactory = await hre.ethers.getContractFactory("WETH");
    const wethAddress = await ethWrapperConrtact.WETHToken();
    
    const WETHContract = await WETHFactory.attach(wethAddress);

    const wrapValue = hre.ethers.utils.parseEther("1");

	  console.log("Wallet Balance before wrapping:", (await WETHContract.balanceOf(wallet.address)).toString());
    
    const tx = await ethWrapperConrtact.connect(wallet).wrap({value: wrapValue});
	  await tx.wait();

    let contractETHBalance = await localProvider.getBalance(ethWrapperConrtact.address);
    console.log("Contract ETH balance after wrapping:", contractETHBalance.toString());

    
	  console.log("Wallet Balance before unwrapping:", (await WETHContract.balanceOf(wallet.address)).toString());

    const approveTx = await WETHContract.connect(wallet).approve(ethWrapperConrtact.address, wrapValue)
	  await approveTx.wait()

	  const unwrapTx = await ethWrapperConrtact.connect(wallet).unwrap(wrapValue)
	  await unwrapTx.wait()

	  
	  console.log("Wallet Balance after unwrapping:", (await WETHContract.balanceOf(wallet.address)).toString());

	  contractETHBalance = await localProvider.getBalance(ethWrapperConrtact.address);
	  console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });   