const hre = require("hardhat");

async function main() {
    const localProvider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545');
    const wallet = new hre.ethers.Wallet("0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0", localProvider);

    const ETHWrapperFactory = await hre.ethers.getContractFactory("ETHWrapper");
    const ETHWrapperContract = await ETHWrapperFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    
    const WETHFactory = await hre.ethers.getContractFactory("WETH");
    const wethAddress = await ETHWrapperContract.WETHToken();
    console.log(wethAddress);
    const WETHContract = await WETHFactory.attach(wethAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });   