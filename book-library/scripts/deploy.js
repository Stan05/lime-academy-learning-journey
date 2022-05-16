const hre = require('hardhat')
const ethers = hre.ethers;

async function deployLibraryContract(arguments) {
    await hre.run('compile');
    const [deployer] = await ethers.getSigners();
  
    console.log('Deploying contracts with the account:', deployer.address); 
    console.log('Account balance:', (await deployer.getBalance()).toString());

    const Library = await ethers.getContractFactory("Library"); // 
    const library = await Library.deploy();
    console.log('Waiting for Library deployment... ');
    await library.deployed();
    
    console.log('Library Contract address: ', library.address);

    if (arguments.verifycontract) {
        console.log('Verifing Contract');
        await hre.run('verify:verify', {
            address: library.address,
            constructorArguments: [],
        });
        console.log('Contract Verified in Etherscan');

    }
}
  
module.exports = deployLibraryContract;