import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { createWalletClient, custom } from "viem";

// Zircuit testnet chain config
const zircuitTestnet = {
  id: 48899,
  name: "Zircuit Testnet",
  rpcUrl: "https://garfield-testnet.zircuit.com",
};

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize wallet client and check connection on mount
  useEffect(() => {
    const initWallet = async () => {
      if (!window.ethereum) {
        setError("No Web3 provider detected. Please install MetaMask.");
        return;
      }

      try {
        const walletClient = createWalletClient({
          chain: zircuitTestnet,
          transport: custom(window.ethereum),
        });
        setClient(walletClient);

        // Check if already connected
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          setWalletAddress(accounts[0] || null);
        });
      } catch (err) {
        setError("Failed to initialize wallet: " + (err as Error).message);
      }
    };

    initWallet();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum || !client) {
      setError("Web3 provider not available.");
      return;
    }

    try {
      setError(null);
      const accounts = await client.requestAddresses();
      const address = accounts[0];
      setWalletAddress(address);
      console.log("Connected to wallet:", address);
    } catch (err) {
      setError("Wallet connection failed: " + (err as Error).message);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        isConnected: !!walletAddress,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
