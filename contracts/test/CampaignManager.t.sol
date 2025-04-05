// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CampaignManager, Campaign} from "../src/CampaignManager.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract CounterTest is Test {
    CampaignManager public campaignManager;
    address USDC = 0x3b952c8C9C44e8Fe201e2b26F6B2200203214cfF;
    address public constant TESTER = address(0xBEEF);

    function setUp() public {
        string memory url = vm.rpcUrl("zircuit_testnet");
        vm.createSelectFork(url);
        campaignManager = new CampaignManager(USDC);
    }

    function test_donate() public {
        Campaign memory newCampaign = campaignManager.createCampaign("Test Campaign", 100, block.timestamp + 100);

        // get campaign
        Campaign[] memory campaigns = campaignManager.allCampaigns();
        // Campaign[] memory campaigns = campaignManager.campaigns;
        Campaign memory campaign = campaigns[0];
        vm.startPrank(TESTER);
        deal(TESTER, 1 ether);
        deal(USDC, TESTER, 100);
        console.log(IERC20(USDC).balanceOf(TESTER));
        campaignManager.donateProxy(campaign.id, address(0), 0);
        vm.stopPrank();
        // console.log(newCampaign.name, newCampaign.amount, newCampaign.reciever, newCampaign.deadline);
        // console.log(newCampaign.id);
        // assertEq(counter.number(), 1);
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
