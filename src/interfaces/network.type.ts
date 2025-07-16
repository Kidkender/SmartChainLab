export type ChainType = "evm" | "solana" | "ton" | "aptos" | "sui" | "near";

export interface ChainInfo {
  name: string;
  chainId: number | string;
  type: ChainType;
  explorer?: string;
  rpcUrl?: string;
  currency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  logoUrl?: string;
  isTestnet?: boolean;
}
