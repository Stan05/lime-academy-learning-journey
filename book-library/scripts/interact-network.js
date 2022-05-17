const hre = require('hardhat');
const ethers = require('ethers');
const config = require("dotenv").config();
const Library = require('../artifacts/contracts/Library.sol/Library.json');

async function interactNetwork(contractNetwork, contractAddress) {
	const alchemyProvider = new hre.ethers.providers.AlchemyProvider(contractNetwork, config.parsed.ALCHEMY_API_KEY)
    const ownerWallet = new hre.ethers.Wallet(config.parsed.PRIVATE_KEY, alchemyProvider);

    const libraryContract = new hre.ethers.Contract(contractAddress, Library.abi, ownerWallet)
    
    // Check all books
    console.log('All Books: ', await libraryContract.getAllBooks());
    
    /*// Add a Book
    const addBookTransaction = await libraryContract.addBook('Book 1', 1);
	const transactionReceipt = await addBookTransaction.wait();
    if (transactionReceipt.status != 1) { 
		console.log("Adding a Book was not successful");
		return 
	}*/
    
    // Check all books
    console.log('All Books: ', await libraryContract.getAllBooks());

    // Borrow a book
    const account2 = new hre.ethers.Wallet(config.parsed.TEST_ACCOUNT_PRIVATE_KEY, alchemyProvider);
    const account2ContractInstance = await libraryContract.connect(account2);

    const borrowBookTransaction = await account2ContractInstance.borrowBook('Book 1', {gasPrice: ethers.utils.parseUnits('150', 'gwei'), gasLimit: 300000});
    const borrowBookReceipt = await borrowBookTransaction.wait();
    if (borrowBookReceipt.status != 1) { 
		console.log('Borrowing the Book was not successful');
		return;
	}
    console.log('Borrowed Book 1');
    
    // Checks that it is rented
    console.log('Book 1 is borrowed by ', await libraryContract.getBorrowedAddressesForBook('Book 1'))
    
    // Returns the book
    const returnBookTransaction = await account2ContractInstance.returnBook('Book 1');
    const returnBookReceipt = await returnBookTransaction.wait();
    if (returnBookReceipt.status != 1) {
        console.log('Returning the Book was not successful');
        return;
    }
    console.log('Returned Book 1');

    // Checks the availability of the book
    console.log('Is Book 1 available: ', await libraryContract.isBookAvailable('Book 1'));
}

module.exports = interactNetwork;