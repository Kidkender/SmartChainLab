import { FunctionForm } from "@/components/functionForm";
import type { ChainInfo } from "@/interfaces/network.type";

export function FunctionList({
  abi,
  address,
  chain,
}: {
  abi: any[];
  address: string;
  chain: ChainInfo;
}) {
  let functions: any[] = [];

  if (chain.type === "evm") {
    functions = abi.filter(
      (f) => f.type === "function" && f.stateMutability === "view"
    );
  } else if (chain.type === "solana") {
    functions = abi;
  }

  if (functions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No readable functions found in {chain.type === "evm" ? "ABI" : "IDL"}.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Functions</h2>
      {functions.map((fn, idx) => (
        <FunctionForm
          key={`${fn.name}-${idx}`}
          fn={fn}
          address={address}
          chain={chain}
        />
      ))}
    </div>
  );
}
