import { http, createConfig } from "wagmi";
import { zircuitGarfieldTestnet } from "../chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [zircuitGarfieldTestnet],
  connectors: [injected()],
  transports: {
    [zircuitGarfieldTestnet.id]: http(),
  },
});
