// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

contract DelegateValueStorage {
    
    uint256 public number;

    function store(uint256 _number) public {
        number = _number + 5;
    }

}

contract ValueStorage {

    uint256 number;

    function store(address _delegateStorageAddress, uint256 _number) external {
        (bool succes, ) = _delegateStorageAddress.delegatecall(
            abi.encodeWithSelector(DelegateValueStorage.store.selector, _number)
        );
        require(succes, "delegatecall has failed");
    }

    function retrieve() public view returns (uint256){
        return number;
    }
}