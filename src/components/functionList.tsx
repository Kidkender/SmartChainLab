import { FunctionForm } from "@/components/functionForm";
import type { ChainInfo } from "@/interfaces/network.type";
import type { AbiItem } from "@/interfaces/function.type";
import { useState } from "react";

export function FunctionList({
  abi,
  address,
  chain,
}: {
  abi: any[];
  address: string;
  chain: ChainInfo;
}) {
  let functions: AbiItem[] = [];
  const [activeTab, setActiveTab] = useState<"read" | "write">("read");

  let readFunctions: AbiItem[] = [];
  let writeFunctions: AbiItem[] = [];

  if (chain.type === "evm") {
    readFunctions = abi.filter(
      (f) =>
        f.type === "function" &&
        (f.stateMutability === "view" || f.stateMutability === "pure")
    );
    writeFunctions = abi.filter(
      (f) =>
        f.type === "function" &&
        (f.stateMutability === "nonpayable" || f.stateMutability === "payable")
    );
    functions = activeTab === "read" ? readFunctions : writeFunctions;
  } else if (chain.type === "solana") {
    functions = abi;
  }

  // Tab UI for EVM
  return (
    <div>
      {chain.type === "evm" && (
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "read"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("read")}
          >
            Read
          </button>
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "write"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("write")}
          >
            Write
          </button>
        </div>
      )}
      {functions.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No{" "}
          {chain.type === "evm"
            ? activeTab === "read"
              ? "readable"
              : "writable"
            : "readable"}{" "}
          functions found in {chain.type === "evm" ? "ABI" : "IDL"}.
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Functions</h2>
          {functions.map((fn, idx) => (
            <FunctionForm
              key={`${fn.name}-${idx}`}
              abi={abi}
              fn={fn}
              address={address}
              chain={chain}
            />
          ))}
        </div>
      )}
    </div>
  );
}
