// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CampaignManager, Campaign} from "../src/CampaignManager.sol";
import {BatchCallAndSponsor} from "../src/BatchCallAndSponsor.sol";
import {CrowderaToken} from "../src/CrowderaToken.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import {Vm} from "forge-std/Vm.sol";

contract CampagnManagerTest is Test {
    CampaignManager public campaignManager;
    BatchCallAndSponsor public implementation;
    CrowderaToken public nft;

    address USDT = 0x46dDa6a5a559d861c06EC9a95Fb395f5C3Db0742;

    // Alice's address and private key (EOA with no initial contract code).
    address payable ALICE = payable(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    uint256 constant ALICE_PK = 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d;
    // Bob's address and private key (Bob will execute transactions on Alice's behalf).
    address constant BOB = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    uint256 constant BOB_PK = 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a;

    address constant RECEIVIER = address(0x43C31);

    // address public constant ALICE = address(0xBEEF);

    function setUp() public {
        // string memory url = vm.rpcUrl("zircuit_testnet");
        vm.createSelectFork("zircuit");
        nft = new CrowderaToken(address(this));
        campaignManager = new CampaignManager(USDT, address(nft));
        implementation = new BatchCallAndSponsor();
        nft.transferOwnership(address(campaignManager));
    }

    function test_donate() public {
        vm.startPrank(RECEIVIER);
        uint256 donateAmount = 100;
        Campaign memory newCampaign =
            campaignManager.createCampaign("Test Campaign", donateAmount, block.timestamp + 100);
        vm.stopPrank();

        // get campaign
        Campaign[] memory campaigns = campaignManager.allCampaigns();
        // Campaign[] memory campaigns = campaignManager.campaigns;
        Campaign memory campaign = campaigns[0];
        vm.startPrank(ALICE);
        deal(ALICE, 1 ether);
        deal(USDT, ALICE, donateAmount);
        console.log(IERC20(USDT).balanceOf(ALICE));

        // Alice signs a delegation allowing `implementation` to execute transactions on her behalf.
        Vm.SignedDelegation memory signedDelegation = vm.signDelegation(address(implementation), ALICE_PK);
        vm.stopPrank();

        // Bob attaches the signed delegation from Alice and broadcasts it.
        vm.startBroadcast(BOB_PK);
        vm.attachDelegation(signedDelegation);

        // Verify that Alice's account now temporarily behaves as a smart contract.
        bytes memory code = address(ALICE).code;
        require(code.length > 0, "no code written to Alice");
        vm.stopBroadcast();

        // batch transactions and sign
        console.log("Sending 1 ETH from Alice to Bob and transferring 100 tokens to Bob in a single transaction");
        BatchCallAndSponsor.Call[] memory calls = new BatchCallAndSponsor.Call[](2);

        // USDT transfer
        calls[0] = BatchCallAndSponsor.Call({
            to: USDT,
            value: 0,
            data: abi.encodeCall(IERC20.transfer, (address(campaignManager), 100))
        });

        // Donate
        calls[1] = BatchCallAndSponsor.Call({
            to: address(campaignManager),
            value: 0,
            data: abi.encodeCall(CampaignManager.donate, (newCampaign.id, 100))
        });

        bytes memory encodedCalls = "";
        for (uint256 i = 0; i < calls.length; i++) {
            encodedCalls = abi.encodePacked(encodedCalls, calls[i].to, calls[i].value, calls[i].data);
        }

        // Prepare the signature for the transaction.
        bytes32 digest = keccak256(abi.encodePacked(BatchCallAndSponsor(ALICE).nonce(), encodedCalls));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ALICE_PK, MessageHashUtils.toEthSignedMessageHash(digest));

        bytes memory signature = abi.encodePacked(r, s, v);

        // try call alice from BOB
        vm.startPrank(BOB);
        BatchCallAndSponsor(ALICE).execute(calls, signature);
        vm.stopPrank();

        assertEq(IERC20(USDT).balanceOf(ALICE), 0);
        assertEq(IERC20(USDT).balanceOf(RECEIVIER), donateAmount);
    }
}
