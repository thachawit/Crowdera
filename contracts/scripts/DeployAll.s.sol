import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {CampaignManager} from "../src/CampaignManager.sol";
import {BatchCallAndSponsor} from "../src/BatchCallAndSponsor.sol";
import {Constants} from "./Constants.sol";

contract DelegationScript is Script {
    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("zircuit"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        CampaignManager campaignManager = new CampaignManager(Constants.USDT);
        BatchCallAndSponsor batchCallAndSponsor = new BatchCallAndSponsor();
        vm.stopBroadcast();

        // logs
        console.log("CampaignManager: ", address(campaignManager));
        console.log("BatchCallAndSponsor: ", address(batchCallAndSponsor));

        // write json
        string memory json = "";
        vm.serializeAddress(json, "campaignManager", address(campaignManager));
        string memory finalJson = vm.serializeAddress(json, "batchCallAndSponsor", address(batchCallAndSponsor));
        vm.writeJson(finalJson, Constants.DEPLOYMENT_ADDRESSES_PATH);
    }
}
