// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

interface Donate {
    function createCampaign(string memory name, uint256 target, uint256 deadline) external;
}
