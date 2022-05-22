const hre = require('hardhat')
const ethers = hre.ethers;

async function deployContract(contractName, verifycontract) {
    await hre.run('compile');
    const [deployer] = await ethers.getSigners();
    
    console.log('Deploying contract %s with the account: %s', contractName, deployer.address); 
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const Contract = await ethers.getContractFactory(contractName); // 
    const contract = await Contract.deploy();
    console.log('Waiting for deployment... ');
    await contract.deployed();
    
    console.log('%s Contract deployed on address: %s', contractName, contract.address);

    if (verifycontract) {
        console.log('Verifing Contract');
        await hre.run('verify:verify', {
            address: contract.address,
            constructorArguments: [],
        });
        console.log('Contract Verified in Etherscan');

    }
}
  
module.exports = deployContract;