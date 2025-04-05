pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {CampaignManager} from "./CampaignManager.sol";

contract DonateImpl {
    CampaignManager public campaignManager;

    constructor(address _campaignManager) {
        campaignManager = CampaignManager(_campaignManager);
    }

    function donate(CampaignManager _campaignManager, uint256 campaignId, address receiver, uint256 amount) external {
        IERC20(_campaignManager.acceptToken()).transfer(address(_campaignManager), amount);
        _campaignManager.donateProxy(campaignId, receiver, amount);
    }
}
