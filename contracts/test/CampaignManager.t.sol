// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CampaignManager, Campaign} from "../src/CampaignManager.sol";

contract CounterTest is Test {
    CampaignManager public campaignManager;
    address USDT = 0xF2147b998141887Be7FA7834CCCD135e0067321a;

    function setUp() public {
        string memory url = vm.rpcUrl("zircuit_testnet");
        vm.createSelectFork(url);
        campaignManager = new CampaignManager(USDT);
        // counter.setNumber(0);
    }

    function test_Increment() public {
        Campaign memory newCampaign = campaignManager.createCampaign("Test Campaign", 100, block.timestamp + 100);
        console.log(newCampaign.name, newCampaign.amount, newCampaign.reciever, newCampaign.deadline);
        console.log(newCampaign.id);
        // assertEq(counter.number(), 1);
    }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
