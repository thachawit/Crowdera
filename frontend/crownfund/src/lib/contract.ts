import { parseAbi } from "viem";

export const campaignContractAddress =
  "0x01F62c474744d7695cc7EB5DDe75901146f803bC" as `0x${string}`;
export const campaignAbi = parseAbi([
  // Struct definition
  "struct Campaign { uint256 id; string name; uint256 target; uint256 raised; address receiver; uint256 deadline; }",
  // Constructor
  "constructor(address token)",
  // Error
  "error SafeERC20FailedOperation(address token)",
  // Functions
  "function acceptToken() view returns (address)",
  "function allCampaigns() view returns (Campaign[])",
  "function campaignFromId(uint256) view returns (uint256 id, string name, uint256 target, uint256 raised, address receiver, uint256 deadline)",
  "function campaigns(uint256) view returns (uint256 id, string name, uint256 target, uint256 raised, address receiver, uint256 deadline)",
  "function createCampaign(string name, uint256 targetAmount, uint256 deadline) returns (Campaign newCampaign)",
  "function donate(uint256 campaignId, uint256 amount)",
  "function organizerCampaignIds(address) view returns (uint256)",
]);

export const mockUsdtContractAddress =
  "0x703037BEfA9E3A74981C5e683D6fd5EA088594A8" as `0x${string}`; // Replace with deployed address

export const mockUsdtAbi = parseAbi([
  "constructor(uint256 initialSupply)",
  "error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)",
  "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
  "error ERC20InvalidApprover(address approver)",
  "error ERC20InvalidReceiver(address receiver)",
  "error ERC20InvalidSender(address sender)",
  "error ERC20InvalidSpender(address spender)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
]);
