pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

struct Campaign {
    uint256 id;
    string name;
    uint256 target;
    uint256 raised;
    address reciever;
    uint256 deadline;
}

contract CampaignManager {
    using SafeERC20 for IERC20;

    mapping(address => uint16) public organizerCount;
    mapping(address => mapping(uint256 => Campaign)) public campaigns;
    address acceptToken;

    constructor(address token) {
        acceptToken = token;
    }

    function createCampaign(string memory name, uint256 targetAmount, uint256 deadline)
        external
        returns (Campaign memory newCampaign)
    {
        uint256 count = organizerCount[msg.sender]++;
        uint256 id = uint256(keccak256(abi.encodePacked(msg.sender, count));
        newCampaign = Campaign({
            id: id,
            name: name,
            target: targetAmount,
            raised: 0,
            reciever: msg.sender,
            deadline: deadline
        });
        campaigns[msg.sender][id] = newCampaign;
    }

    function donateProxy(uint256 campaignId, address receiver, uint256 amount) external {
        Campaign memory campaign = campaign[receiver][campignId];
        require(campaignId == campaign.id, "Mismatched Campaign Id");
        uint amountAfter = campaign.raised + amount
        require(amountAfter <= campaign.target, "Target Reached")
        IERC20(acceptToken).safeTransferFrom(msg.sender, receiver, amount);
    }
}
