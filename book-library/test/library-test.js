const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Library", function () {  
    const BOOK_ID = "Book 1";

    let libraryContract;
    let library;
    let user, user2;

    before(async () => {
        libraryContract = await ethers.getContractFactory("Library");
        library = await libraryContract.deploy();
        await library.deployed();
        [, user, user2] = await ethers.getSigners();
    });

    it("Should have no books at the begining", async function () {
        expect(await library.getAllBooks()).to.have.lengthOf(0);
    });

    it("Should allow adding of new book", async function () {
      expect(await library.addBook(BOOK_ID, 1)).to.emit(library, 'BookAdded');
      expect(await library.getAllBooks()).to.have.lengthOf(1);
    });

    it("Should allow only owner to add a book", async function () {
      await expect(library.connect(user).addBook(BOOK_ID, 1)).to.be.revertedWith('Not invoked by the owner');
      expect(await library.getAllBooks()).to.have.lengthOf(1);
    });

    it("Should allow borrowing a book", async function () {
      expect(await library.connect(user).borrowBook(BOOK_ID)).to.emit(library, 'BookBorrowed');
      expect(await library.isBookAvailable(BOOK_ID)).to.be.false;
    });

    it("Should not allow to borrow book without available copies", async function () {
      await expect(library.connect(user).borrowBook(BOOK_ID)).to.be.revertedWith('The book has no available copies at the moment!');
    });

    it("Should allow adding copies to existing book", async function () {
      expect(await library.addBook(BOOK_ID, 1)).to.emit(library, 'BookCopiesAdded');
      expect(await library.isBookAvailable(BOOK_ID)).to.be.true;
    });

    it("Should not allow borrowing the same book twice by one person", async function () {
      await expect(library.connect(user).borrowBook(BOOK_ID)).to.be.revertedWith('The book is currently borrowed by this user!');
    });

    it("Should to return a book", async function () {
      expect(await library.connect(user).returnBook(BOOK_ID)).to.emit(library, 'BookReturned');
      expect(await library.getAllBooks()).to.have.lengthOf(1);
    })

    it("Should not allow to return book that is not borrowed", async function () {
      await expect(library.connect(user).returnBook(BOOK_ID)).to.be.revertedWith('The book is not borrowed by this user!');
    })

    it("Should show who has borrowed a book", async function () {
      expect(await library.getBorrowedAddressesForBook(BOOK_ID)).to.include(user.address);
    })
});