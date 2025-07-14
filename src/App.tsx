import { AbiInput } from "@/components/abiInput"
import { FunctionList } from "@/components/functionList"
import { useState } from "react"


export default function App() {
  const [abi, setAbi] = useState<any[]>([])
  const [address, setAddress] = useState("")

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">SmartChainLab 🧪</h1>
      <AbiInput
        onLoad={(abiData, addr) => {
          setAbi(abiData)
          setAddress(addr)
        }}
      />
      {abi.length > 0 && <FunctionList abi={abi} address={address} />}
    </main>
  )
}
