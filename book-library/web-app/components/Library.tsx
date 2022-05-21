import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useLibraryContract from "../hooks/useLibraryContract";
import Spinner from "./Spinner";

type LibraryContract = {
  contractAddress: string;
  isOwnerConnected: boolean;
};

const Library = ({ contractAddress, isOwnerConnected }: LibraryContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const libraryContract = useLibraryContract(contractAddress);

  const [availableBooks, setAvailableBooks] = useState<string[]>(['Unknown']);
  const [allBooks, setAllBooks] = useState<string[]>(['Unknown']);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  // Add book state
  const [addBookName, setAddBookName] = useState('');
  const [addBookCopies, setAddBookCopies] = useState(0);

  useEffect(() => {
    getAvailableBooks();
    getAllBooks();
  },[])
  
  // General functionallity
  const getAvailableBooks = async () => {
    const availableBooks = await (await libraryContract.getAvailableBooks()).filter(book => book.trim() != '');
    setAvailableBooks(availableBooks);
  }
  const getAllBooks = async () => {
    const allBooks = await libraryContract.getAllBooks();
    setAllBooks(allBooks);
  }

  // User Borrow Book handler
  const handleBorrowBook = async event => {
    if (event.target.value != '' && availableBooks.some(v => v === event.target.value)) {
      event.preventDefault();      
      setShowSpinner(true);
      const tx = await libraryContract.borrowBook(event.target.value);
      await tx.wait();
      setShowSpinner(false);
      getAvailableBooks();
      resetAddBookForm();
    } else {
      console.log('Invalid data to submit request');
    }
  }

  // Admin Form Elements handlers
  const handleAddBook = async event => {
    if (addBookName.trim() != '' && addBookCopies > 0) {
      event.preventDefault();      
      setShowSpinner(true);
      const tx = await libraryContract.addBook(addBookName.trim(), addBookCopies);
      await tx.wait();
      setShowSpinner(false);
      getAllBooks();
      resetAddBookForm();
    } else {
      console.log('Invalid data to submit request');
    }
  }
  const handleAddBookNameChange = event => {
    setAddBookName(event.target.value);
  };
  const handleAddBookCopiesChange = event => {
    setAddBookCopies(event.target.value);
  };
  const resetAddBookForm = () => {
    setAddBookName('');
    setAddBookCopies(0);
  }

  // Admin Module components
  function adminModule() {
    return <div className="admin-panel">
      <p>You are logged in as Adminstrator</p>
      
      {showSpinner 
      ? <div className="pos-center"><Spinner/></div>
      : 
      <div className="add-book-input">
        <label>
          Book Name:
          <input type="text" name="bookName" value={addBookName} onChange={handleAddBookNameChange}/>
        </label>
        <label>
          Number of copies:
          <input type="number" name="bookCopies"  value={addBookCopies} onChange={handleAddBookCopiesChange}/>
        </label>
        <button onClick={handleAddBook}>Add Book</button>
      </div>}
      
      <div className="all-books">
        {allBooks.map(bookId => <p key={bookId}>{bookId}</p>)}
      </div>
    </div>;
  }

  // User Module components
  function userModule() {
    return <div className="user-panel">
      <p>
        LimeLibrary currently has the following books available
      </p>
      { showSpinner ? <div className="pos-center"><Spinner/></div> :
      <div className="books-panel">
        {availableBooks.map(bookId => renderBook(bookId))}
      </div>
      }
    </div>;
  }

  function renderBook(bookId: string): any {
    return <div className="single-book">
      <p key={bookId}>{bookId}</p>
      <button onClick={handleBorrowBook} value={bookId}>Borrow</button>
    </div>
  }

  return (
    <div>
       {isOwnerConnected 
       ? adminModule()
       : userModule()
       }
    </div>
  );
};

export default Library;

