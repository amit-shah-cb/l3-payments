// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Target {
    event KycUpdated(address indexed attester, address indexed recipient);

    function updateKyc(address attester, address recpient) external {
        emit KycUpdated(attester, recpient);
    }
}