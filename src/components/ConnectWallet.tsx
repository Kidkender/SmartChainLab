import { useState } from "react";
import { CHAIN_LIST } from "@/data/ChainList";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useWallet } from "@solana/wallet-adapter-react";
import type { ChainInfo } from "@/interfaces/network.type";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { shortenAddress } from "@/utils/address";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ConnectWallet({
  onChainChange,
}: {
  onChainChange: (chain: ChainInfo) => void;
}) {
  const [selectedChain, setSelectedChain] = useState<ChainInfo | null>(null);

  // EVM hooks
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { connect: connectEvm } = useConnect();
  const { disconnect: disconnectEvm } = useDisconnect();

  // Solana hooks
  const {
    publicKey,
    connected: isSolanaConnected,
    connect: connectSol,
    disconnect: disconnectSol,
    select,
  } = useWallet();

  const isConnected =
    (selectedChain?.type === "evm" && isEvmConnected && evmAddress) ||
    (selectedChain?.type === "solana" && isSolanaConnected && publicKey);

  const getButtonClass = () => {
    if (!selectedChain) return "bg-gray-300 text-gray-500 cursor-not-allowed";
    if (selectedChain.type === "evm")
      return "bg-blue-600 text-white hover:bg-blue-700";
    if (selectedChain.type === "solana")
      return "bg-purple-600 text-white hover:bg-purple-700";
    return "bg-gray-300 text-gray-500";
  };

  const handleConnect = () => {
    if (!selectedChain) return;
    if (selectedChain.type === "evm") connectEvm({ connector: injected() });
    if (selectedChain.type === "solana") {
      select(PhantomWalletName);
      connectSol();
    }
  };

  const handleDisconnect = () => {
    if (!selectedChain) return;
    if (selectedChain.type === "evm") disconnectEvm();
    if (selectedChain.type === "solana") disconnectSol();
  };

  const getAddress = () => {
    if (selectedChain?.type === "evm" && evmAddress)
      return shortenAddress(evmAddress);
    if (selectedChain?.type === "solana" && publicKey)
      return shortenAddress(publicKey.toBase58());
    return "";
  };

  return (
    <div className="flex gap-4 items-center">
      {/* Chain selector */}
      <Select
        value={selectedChain?.chainId?.toString() || ""}
        onValueChange={(val) => {
          const chain = CHAIN_LIST.find((c) => String(c.chainId) === val);
          setSelectedChain(chain || null);
          if (chain) onChainChange(chain);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Network" />
        </SelectTrigger>
        <SelectContent>
          {CHAIN_LIST.map((chain) => (
            <SelectItem key={chain.chainId} value={String(chain.chainId)}>
              <span className="flex items-center gap-2">
                <img src={chain.logoUrl} alt={chain.name} className="w-5 h-5" />
                {chain.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!isConnected ? (
        <button
          className={`px-4 py-2 rounded transition-colors ${getButtonClass()}`}
          disabled={!selectedChain}
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`font-mono px-3 py-1 rounded cursor-pointer transition-colors 
                                ${
                                  selectedChain.type === "evm"
                                    ? "text-green-700"
                                    : "text-purple-700"
                                }
                                 hover:bg-gray-100`}
            >
              {getAddress()}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2 flex flex-col items-center">
            <button
              className="text-xs px-3 py-1 bg-gray-200 hover:bg-red-200 text-red-700 rounded"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
