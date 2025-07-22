import { createConfig, http } from "wagmi";
import { bscTestnet, mainnet, sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  connectors: [injected(), metaMask()],
  chains: [mainnet, sepolia, bscTestnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
  },
});
