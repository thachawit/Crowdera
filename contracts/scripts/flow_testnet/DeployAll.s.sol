import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {CampaignManager} from "../../src/CampaignManager.sol";
import {BatchCallAndSponsor} from "../../src/BatchCallAndSponsor.sol";
import {Constants} from "./Constants.sol";
import {MockUSD} from "../../src/MockUSD.sol";
import {CrowderaToken} from "../../src/CrowderaToken.sol";

contract DelegationScript is Script {
    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("flow_testnet"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        MockUSD mockUSD = new MockUSD(10_000_000e18);
        CrowderaToken nft = new CrowderaToken(address(vm.addr(privateKey)));
        CampaignManager campaignManager = new CampaignManager(address(mockUSD), address(nft));
        BatchCallAndSponsor batchCallAndSponsor = new BatchCallAndSponsor();
        nft.transferOwnership(address(campaignManager));
        vm.stopBroadcast();

        // logs
        console.log("NFT: ", address(nft));
        console.log("MockUSD: ", address(mockUSD));
        console.log("CampaignManager: ", address(campaignManager));
        console.log("BatchCallAndSponsor: ", address(batchCallAndSponsor));

        // write json
        string memory json = "";
        vm.serializeAddress(json, "nft", address(nft));
        vm.serializeAddress(json, "mockUSD", address(mockUSD));
        vm.serializeAddress(json, "campaignManager", address(campaignManager));
        string memory finalJson = vm.serializeAddress(json, "batchCallAndSponsor", address(batchCallAndSponsor));
        vm.writeJson(finalJson, Constants.DEPLOYMENT_ADDRESSES_PATH);
    }
}
