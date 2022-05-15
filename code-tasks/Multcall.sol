// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

contract TimestampKeeper {

    function getBlockTimestamp() external view returns (uint, uint) {
        return (1, block.timestamp);
    }

    function getBlockTimestamp2() external view returns (uint, uint) {
        return (2, block.timestamp);
    }

    function getBlockTimestampData() external pure returns (bytes memory) {
        return abi.encodeWithSelector(TimestampKeeper.getBlockTimestamp.selector);
    }

    function getBlockTimestampData2() external pure returns (bytes memory) {
        return abi.encodeWithSelector(TimestampKeeper.getBlockTimestamp2.selector);
    }
}

contract Multicall {

    function multicall(address[] memory targets, bytes[] memory data) external view returns(bytes[] memory) {
        require(targets.length == data.length, "targets length does not match data length");
        bytes[] memory results = new bytes[](targets.length);

        for(uint i = 0; i < targets.length; i++) {
            (bool success, bytes memory result) = targets[i].staticcall(data[i]);
            require(success, "call failed");

            results[i] = result;
        }

        return results;
    }
}