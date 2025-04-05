import {Script} from "forge-std/Script.sol";
import {Delegation} from "../src/Delegation.sol";

contract DelegationScript is Script {
    function run() public {
        vm.startBroadcast();
        Delegation delegation = new Delegation();
        // console.log(address(delegation));
        vm.stopBroadcast();
    }
}
