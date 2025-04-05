pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ICampaignManager, Campaign} from "./interfaces/ICampaignManager.sol";

contract CampaignManager is ICampaignManager {
    using SafeERC20 for IERC20;

    mapping(address => uint256) public organizerCampaignIds;
    mapping(uint256 => Campaign) public campaignFromId;
    Campaign[] public campaigns;
    address public acceptToken;

    constructor(address token) {
        acceptToken = token;
    }

    function allCampaigns() external view returns (Campaign[] memory) {
        return campaigns;
    }

    function createCampaign(string memory name, uint256 targetAmount, uint256 deadline)
        external
        returns (Campaign memory newCampaign)
    {
        uint256 id = uint256(keccak256(abi.encodePacked(msg.sender, name, targetAmount, deadline)));
        newCampaign =
            Campaign({id: id, name: name, target: targetAmount, raised: 0, receiver: msg.sender, deadline: deadline});
        campaigns.push(newCampaign);
        organizerCampaignIds[msg.sender] = id;
        campaignFromId[id] = newCampaign;
    }

    function donate(uint256 campaignId, uint256 amount) external {
        Campaign memory campaign = campaignFromId[campaignId];
        uint256 amountAfter = campaign.raised + IERC20(acceptToken).balanceOf(address(this));
        // check if the target has been reached
        require(amountAfter <= campaign.target, "Target Reached");
        // send to the receiver
        IERC20(acceptToken).safeTransfer(campaign.receiver, amount);
    }
}
