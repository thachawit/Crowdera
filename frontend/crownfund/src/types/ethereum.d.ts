// Type declaration for the ethereum property on the window object
declare interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    removeListener: (
      event: string,
      callback: (...args: unknown[]) => void
    ) => void;
    isMetaMask?: boolean;
    // Add additional properties that viem might expect
    selectedAddress?: string;
    networkVersion?: string;
    chainId?: string;
  };
}
