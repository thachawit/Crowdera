import { type Chain } from "viem";

export const zircuitGarfieldTestnet = {
  id: 48898,
  name: "Zircuit Garfield Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://garfield-testnet.zircuit.com/"] },
    public: { http: ["https://garfield-testnet.zircuit.com/"] },
  },
  blockExplorers: {
    default: { name: "Zircuit Explorer", url: "https://explorer.zircuit.com" },
  },
  testnet: true,
} as const satisfies Chain;
