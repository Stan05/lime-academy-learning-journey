
const hre = require('hardhat');
const Library = require('../../artifacts/contracts/Library.sol/Library.json');

const run = async function() {
	const localProvider = new hre.ethers.providers.JsonRpcProvider('http://localhost:8545')
    const ownerWallet = new hre.ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', localProvider);
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const libraryContract = new hre.ethers.Contract(contractAddress, Library.abi, ownerWallet)

    // Check all books
    console.log('All Books: ', await libraryContract.getAllBooks());
    
    // Add a Book
    await addBook(libraryContract, 'Book 1', 1);
    await addBook(libraryContract, 'Book 2', 1);
    await addBook(libraryContract, 'Book 3', 2);
    
    // Check all books
    console.log('All Books: ', await libraryContract.getAllBooks());

    // Rent a book
    const account2 = new hre.ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', localProvider);
    const account2ContractInstance = await libraryContract.connect(account2);

    const borrowBookTransaction = await account2ContractInstance.borrowBook('Book 1');
    const borrowBookReceipt = await borrowBookTransaction.wait();
    if (borrowBookReceipt.status != 1) { 
		console.log('Borrowing the Book was not successful');
		return;
	}
    console.log('Borrowed Book 1');
    
    // - Checks that it is rented
    console.log('Book 1 is borrowed by ', await libraryContract.getBorrowedAddressesForBook('Book 1'))
    
    // Get avaiable books
    console.log('Currently available books', await libraryContract.getAvailableBooks());

    // - Returns the book
    const returnBookTransaction = await account2ContractInstance.returnBook('Book 1');
    const returnBookReceipt = await returnBookTransaction.wait();
    if (returnBookReceipt.status != 1) {
        console.log('Returning the Book was not successful');
        return;
    }
    console.log('Returned Book 1');

    // - Checks the availability of the book
    console.log('Is Book 1 available: ', await libraryContract.isBookAvailable('Book 1'));
}

const addBook = async function(libraryContract, bookName, copies) {
    const addBookTransaction = await libraryContract.addBook(bookName, copies);
	const transactionReceipt = await addBookTransaction.wait();
    if (transactionReceipt.status != 1) { 
		console.log("Adding a Book was not successful");
		process.exit(1);
	}
}

run();