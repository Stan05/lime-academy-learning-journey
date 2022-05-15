// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

contract TimeLock {

    uint public constant MIN_DELAY = 10;
    uint public constant MAX_DELAY = 1000;
    uint public constant GRACE_PERIOD = 1000;

    address private owner;
    mapping(bytes32 => bool) private queued;

    event TransactionQueued(
        bytes32 indexed txId,
        address indexed target, 
        uint value, 
        string func, 
        bytes data, 
        uint timestamp
    );
    event TransactionExecuted(
        bytes32 indexed txId,
        address indexed target, 
        uint value, 
        string func, 
        bytes data, 
        uint timestamp
    );
    event TransactionCanceled(bytes32 txId);

    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error NotQueuedError(bytes32 txId);
    error TimeStampNotInRangeError(uint blockTimestamp, uint timestamp);
    error TimestampNotPassedError(uint blockTimestamp, uint timestamp);
    error TimestampExpiredError(uint blockTimestamp, uint timestamp);
    error TransactionFailedError();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (owner != msg.sender) {
            revert NotOwnerError();
        }
        _;
    }

    function queue(
        address _target, 
        uint _value, 
        string calldata _func, 
        bytes calldata _data, 
        uint _timestamp) external onlyOwner {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);
        if (queued[txId]) {
            revert AlreadyQueuedError(txId);
        }
        if (
            _timestamp < block.timestamp + MIN_DELAY || 
            _timestamp > block.timestamp + MAX_DELAY) {
           revert TimeStampNotInRangeError(block.timestamp, _timestamp);
        }
        queued[txId] = true;
        emit TransactionQueued(txId, _target, _value, _func, _data, _timestamp);
    }

    function execute(
        address _target, 
        uint _value, 
        string calldata _func, 
        bytes calldata _data, 
        uint _timestamp) external payable onlyOwner returns (bytes memory) {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);

        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }

        if (block.timestamp < _timestamp) {
            revert TimestampNotPassedError(block.timestamp, _timestamp);
        }
        if (block.timestamp > _timestamp + GRACE_PERIOD) {
            revert TimestampExpiredError(block.timestamp, _timestamp + GRACE_PERIOD);
        }
        queued[txId] = false;
        
        bytes memory data;
        if(bytes(_func).length > 0) {
            data = abi.encodePacked(
                bytes4(keccak256(bytes(_func))), // function selector
                _data // data to be passed to the function
            );
        } else {
            data = _data;
        }

        (bool success, bytes memory result) = _target.call{value: _value}(data);
        if (!success) {
            revert TransactionFailedError();
        }
        emit TransactionExecuted(txId, _target, _value, _func, _data, _timestamp);
        return result;
    }

    function cancel(bytes32 _txId) external onlyOwner {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit TransactionCanceled(_txId);
    }

    function getTxId(
        address _target, 
        uint _value, 
        string calldata _func, 
        bytes calldata _data, 
        uint _timestamp) public pure returns(bytes32) {
        return keccak256(
            abi.encode(_target, _value, _func, _data, _timestamp)
        );
    }
}

contract Bank {

    error NotInvokedByTimeLock();

    address private timeLock;
    uint public fee = 1;

    constructor(address _timeLock) {
        timeLock = _timeLock;
    }

    function recieve() external payable {}

    function changeFee(uint _fee) external payable {
        if (timeLock != msg.sender) {
           revert NotInvokedByTimeLock();
        }
        fee = _fee;
    }
}

contract Helper {

    function getTimestamp() external view returns (uint) {
        return block.timestamp + 15;
    }
    
    function getFunctionCallData(uint _feeParam) external pure returns (bytes memory) {
        return abi.encodeWithSelector(Bank.changeFee.selector, _feeParam);
    }
}
