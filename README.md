# lime-academy-learning-journey
The repository stores small tasks related to my LimeAcademy Season 3 learning journey.

# Tasks 
## Blockchain 101
### Intro to Blockchain
- __What is a transaction?__

A transaction is set of instructions that alters the ledger.

- __What is the approximate time of every Ethereum transaction?__

It dependes on how fast a block of transaction is produced, what is the congestion of the network and how much gas the sender of the transaction is willing to pay.
Approximately a block is produced every 13 seconds.

- __What is a node?__

A node is a computer that processes transactions, relays the received transactions to the rest of the nodes ("gossiping"), maintains a local state of the general ledger and work to reach a consensus with the rest of the network, over the current state of the ledger, through consesus algorithms.

## Solidity & Smart Contracts 101
### Learning Solidity

- __What is delegatecall? Give example with code.__

Delegate call is invoking a contract method by using the caller's contract state. This way we can achieve upgrading of one contract logic without redeploying it. However, the contract that we are calling should have the same state variables, as well as keeping the same layout as the caller's contract state variables.

```
contract DelegateValueStorage {
    uint256 public number;

    function store(uint256 _number) public {
        number = _number + 5;
    }

}
contract ValueStorage {

    uint256 number;

    function store(address _delegateStorageAddress, uint256 _number) external {
        (bool succes, bytes memory data) = _delegateStorageAddress.delegatecall(
            abi.encodeWithSelector(DelegateValueStorage.store.selector, _number)
        );
        require(succes, "delegatecall has failed");
    }

    function retrieve() public view returns (uint256){
        return number;
    }
}
```

- __What is multicall? Give example with code.__


- __What is time lock? Give example with code.__

