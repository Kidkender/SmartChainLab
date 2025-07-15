import { FunctionForm } from "@/components/functionForm";
import type { ChainInfor } from "@/interfaces/network";

export function FunctionList({ abi, address, chain }: { abi: any[]; address: string; chain: ChainInfor }) {
  const functions = abi.filter((f) => f.type === "function" && f.stateMutability === "view")

  if (functions.length === 0) {
    return <div className="text-sm text-muted-foreground">No readable functions found in ABI.</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Functions</h2>
      {functions.map((fn, idx) => (
        <FunctionForm key={`${fn.name}-${idx}`} fn={fn} address={address} />
      ))}
    </div>
  )
}
