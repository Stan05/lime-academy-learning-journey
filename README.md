# lime-academy-learning-journey

The repository stores small tasks related to my LimeAcademy Season 3 learning journey.

# Tasks

## Blockchain 101

### Intro to Blockchain

- **What is a transaction?**

A transaction is set of instructions that alters the ledger.

- **What is the approximate time of every Ethereum transaction?**

It dependes on how fast a block of transaction is produced, what is the congestion of the network and how much gas the sender of the transaction is willing to pay.
Approximately a block is produced every 13 seconds.

- **What is a node?**

A node is a computer that processes transactions, relays the received transactions to the rest of the nodes ("gossiping"), maintains a local state of the general ledger and work to reach a consensus with the rest of the network, over the current state of the ledger, through consesus algorithms.

## Solidity & Smart Contracts 101

### Learning Solidity

- **What is delegatecall? Give example with code.**

Delegate call is invoking a contract method by using the caller's contract state. This way we can achieve upgrading of one contract logic without redeploying it. However, the contract that we are calling should have the same state variables, as well as keeping the same layout as the caller's contract state variables.

[Code example](/code-tasks/Delegatecall.sol)

- **What is multicall? Give example with code.**

Multicall provides you with functionality to batch together multiple calls in a single external call.

[Code example](/code-tasks/Delegatecall.sol)

- **What is time lock? Give example with code.**

Time lock is a mechanism to delay function calls to smart contract after a predetermined amount of time has passed, typically it's atleast 24 hours. Implementing this mechanism in your smart contract gives your users more transparency of the actions you are initiating as the owner of the smart contract.

[Code example](/code-tasks/Timelock.sol)

### Hardhat

- **Book Library smart contract deployment**

The Book Library contract can be found on Goerli network in [Etherscan](https://goerli.etherscan.io/address/0xaaac648458954e0083ddd9e30adf48600ff35080).
