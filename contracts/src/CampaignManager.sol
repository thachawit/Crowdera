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

    mapping(address => uint256) public organizerCampaignIds;
    mapping(uint256 => Campaign) public campaignFromId;
    Campaign[] public campaigns;
    address public acceptToken;

    constructor(address token) {
        acceptToken = token;
    }

    function allCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    function createCampaign(string memory name, uint256 targetAmount, uint256 deadline)
        external
        returns (Campaign memory newCampaign)
    {
        uint256 id = uint256(keccak256(abi.encodePacked(msg.sender, name, targetAmount, deadline)));
        newCampaign =
            Campaign({id: id, name: name, target: targetAmount, raised: 0, reciever: msg.sender, deadline: deadline});
        campaigns.push(newCampaign);
        organizerCampaignIds[msg.sender] = id;
        campaignFromId[id] = newCampaign;
    }

    function donateProxy(uint256 campaignId, address receiver, uint256 amount) external {
        uint256 receivedAmount = IERC20(acceptToken).balanceOf(address(this));
        require(receivedAmount > 0, "No tokens received");
        Campaign memory campaign = campaignFromId[campaignId];
        uint256 amountAfter = campaign.raised + receivedAmount;
        require(amountAfter <= campaign.target, "Target Reached");
    }
}
