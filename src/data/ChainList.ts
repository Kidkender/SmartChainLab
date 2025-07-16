import type { ChainInfo } from "@/interfaces/network.type";

export const CHAIN_LIST: ChainInfo[] = [
  // === EVM chains ===
  {
    name: "Sepolia",
    chainId: "11155111",
    type: "evm",
    explorer: "https://sepolia.etherscan.io",
    currency: { name: "Ether", symbol: "ETH", decimals: 18 },
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
  },
  {
    name: "Polygon",
    chainId: 137,
    type: "evm",
    explorer: "https://polygonscan.com",
    currency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/28321.png",
  },

  // === Solana ===
  //   {
  //     name: "Solana Mainnet",
  //     chainId: "mainnet-beta",
  //     type: "solana",
  //     explorer: "https://explorer.solana.com",
  //     currency: { name: "Solana", symbol: "SOL", decimals: 9 },
  //     logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
  //   },

  {
    name: "Solana Devnet",
    chainId: "devnet",
    type: "solana",
    explorer: "https://explorer.solana.com?cluster=devnet",
    isTestnet: true,
    currency: { name: "Solana", symbol: "SOL", decimals: 9 },
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
    rpcUrl: "https://api.devnet.solana.com",
  },

  // === TON ===
  //   {
  //     name: "TON Mainnet",
  //     chainId: "ton-mainnet",
  //     type: "ton",
  //     explorer: "https://tonscan.org",
  //     currency: { name: "Toncoin", symbol: "TON", decimals: 9 },
  //     logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
  //   },

  {
    name: "TON Testnet",
    chainId: "ton-testnet",
    type: "ton",
    explorer: "https://testnet.tonscan.org",
    isTestnet: true,
    currency: { name: "Toncoin", symbol: "TON", decimals: 9 },
    logoUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
  },
];
