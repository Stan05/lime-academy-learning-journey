const hre = require('hardhat')
const ethers = hre.ethers;

async function deployLibraryContract(_privateKey) {
    await hre.run('compile'); 
    const wallet = new ethers.Wallet(_privateKey, hre.ethers.provider) // New wallet with the privateKey passed from CLI as param
    console.log('Deploying contracts with the account:', wallet.address); 
    console.log('Account balance:', (await wallet.getBalance()).toString()); 

    const Library = await ethers.getContractFactory("Library", wallet);
    const library = await Library.deploy();
    console.log('Waiting for Library deployment...');
    await library.deployed();

    console.log('Library Contract address: ', library.address);
    console.log('Done!');
}
  
module.exports = deployLibraryContract;