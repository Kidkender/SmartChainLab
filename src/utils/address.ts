import type { ChainType } from "@/interfaces/network.type";

export function shortenAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isValidAddress(address: string, chainType: ChainType): boolean {
  if (chainType === "evm") {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  } else if (chainType === "solana") {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  return false;
}
