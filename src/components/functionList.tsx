import { FunctionForm } from "@/components/functionForm"

export function FunctionList({ abi, address }: { abi: any[], address: string }) {
  const functions = abi.filter((f) => f.type === "function" && f.stateMutability === "view")

  return (
    <div className="mt-6 space-y-4">
      {functions.map((fn) => (
        <FunctionForm key={fn.name} fn={fn} address={address} />
      ))}
    </div>
  )
}
