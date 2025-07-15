import { AbiInput } from "@/components/abiInput"
import { FunctionList } from "@/components/functionList"
import { CHAIN_LIST } from "@/data/ChainList"
import type { ChainInfor } from "@/interfaces/network"
import { useState } from "react"

export default function App() {
  const [abi, setAbi] = useState<any[] | null>(null)
  const [address, setAddress] = useState("")
  const [chain, setChain] = useState<ChainInfor | null>(null)

  const isReady = abi && address && chain

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            SmartChainLab <span className="text-xl">🧪</span>
          </h1>

          <a
            href="https://github.com/Kidkender/SmartChainLab" 
            target="_blank"
            className="text-sm underline text-blue-600 hover:text-blue-800"
          >
            GitHub
          </a>
        </header>

        <section className="bg-white shadow-sm rounded-xl p-6 space-y-4 border">
          <h2 className="text-lg font-semibold text-gray-800">🧩 Load Contract ABI</h2>
          <AbiInput
            onSubmit={(abiData, addr, selectedChainId) => {
              setAbi(abiData)
              setAddress(addr)
              const found = CHAIN_LIST.find((c) => c.chainId.toString() === selectedChainId)
              setChain(found || null)
            }}
          />

        </section>

        {!isReady && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md flex items-center gap-2">
            <span>📂</span>
            <span>Please select ABI file, enter address, and select network to start</span>
          </div>
        )}

        {isReady && (
          <>
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-sm">
              ✅ ABI loaded for contract <code>{address.slice(0, 6)}...{address.slice(-4)}</code> on <strong>{chain.name}</strong>
            </div>

            <section className="bg-white shadow-sm rounded-xl p-6 space-y-4 border">
              <h2 className="text-lg font-semibold text-gray-800">🔧 Available Functions</h2>
              <FunctionList abi={abi} address={address} chain={chain} />
            </section>
          </>
        )}
      </div>
    </main>
  )
}
