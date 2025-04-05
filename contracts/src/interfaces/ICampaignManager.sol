// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

struct Campaign {
    uint256 id;
    string name;
    uint256 target;
    uint256 raised;
    address receiver;
    uint256 deadline;
}

interface ICampaignManager {
    function allCampaigns() external view returns (Campaign[] memory);
    function createCampaign(string memory name, uint256 targetAmount, uint256 deadline)
        external
        returns (Campaign memory);
    function donate(uint256 campaignId, uint256 amount) external;
}
