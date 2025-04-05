// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CampaignManager, Campaign} from "../src/CampaignManager.sol";
import {DonateImpl} from "../src/DonateImpl.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Vm} from "forge-std/Vm.sol";

contract CounterTest is Test {
    CampaignManager public campaignManager;
    DonateImpl public donateImpl;

    address USDC = 0x3b952c8C9C44e8Fe201e2b26F6B2200203214cfF;

    // Alice's address and private key (EOA with no initial contract code).
    address payable ALICE = payable(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    uint256 constant ALICE_PK = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
    // Bob's address and private key (Bob will execute transactions on Alice's behalf).
    address constant BOB = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    uint256 constant BOB_PK = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;

    // address public constant ALICE = address(0xBEEF);

    function setUp() public {
        string memory url = vm.rpcUrl("zircuit_testnet");
        vm.createSelectFork(url);
        campaignManager = new CampaignManager(USDC);
        donateImpl = new DonateImpl(address(campaignManager));
    }

    function test_donate() public {
        uint256 donateAmount = 100;
        Campaign memory newCampaign =
            campaignManager.createCampaign("Test Campaign", donateAmount, block.timestamp + 100);

        // get campaign
        Campaign[] memory campaigns = campaignManager.allCampaigns();
        // Campaign[] memory campaigns = campaignManager.campaigns;
        Campaign memory campaign = campaigns[0];
        vm.startPrank(ALICE);
        deal(ALICE, 1 ether);
        deal(USDC, ALICE, donateAmount);
        console.log(IERC20(USDC).balanceOf(ALICE));

        // Alice signs a delegation allowing `implementation` to execute transactions on her behalf.
        Vm.SignedDelegation memory signedDelegation = vm.signDelegation(address(donateImpl), ALICE_PK);
        vm.stopPrank();

        // Bob attaches the signed delegation from Alice and broadcasts it.
        vm.startBroadcast(BOB_PK);
        vm.attachDelegation(signedDelegation);

        // Verify that Alice's account now temporarily behaves as a smart contract.
        bytes memory code = address(ALICE).code;
        require(code.length > 0, "no code written to Alice");
        vm.stopBroadcast();

        // try call alice from BOB
        // TODO: implement check signature on donate impl contract
        vm.startPrank(BOB);
        DonateImpl(ALICE).donate(campaignManager, newCampaign.id, newCampaign.reciever, donateAmount);
        vm.stopPrank();
    }
}
