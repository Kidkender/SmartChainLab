import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CHAIN_LIST } from "@/data/ChainList"
import { extractABI } from "@/utils/abi"
import { useState } from "react"
import { useDropzone } from "react-dropzone"


export function AbiInput({
  onSubmit,
}: {
  onSubmit: (abi: any[], address: string, chainId: string) => void
}) {
  const [abi, setAbi] = useState<any[] | null>(null)
  const [fileName, setFileName] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [chainId, setChainId] = useState<string>("");

  const handleTrySubmit = (nextAbi: any[] | null, nextAddress: string) => {
    if (nextAbi && /^0x[a-fA-F0-9]{40}$/.test(nextAddress)) {
      onSubmit(nextAbi, nextAddress, chainId)
    }
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string)
        const abiParsed = extractABI(raw)
        setAbi(abiParsed.abi)
        setFileName(file.name)
        handleTrySubmit(abiParsed.abi, address)
      } catch (err) {
        alert((err as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/json": [".json"] },
    multiple: false,
    onDrop: (files) => {
      const file = files[0]
      if (file) handleFile(file)
    },
  })
  

  return (
    <div className="space-y-4">

      <Select onValueChange={(value) => setChainId(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select network"/>
        </SelectTrigger>
        <SelectContent>
          {CHAIN_LIST.map((chain) => (
            <SelectItem
              key={chain.chainId.toString()}
              value={chain.chainId.toString()}
            className="flex items-center gap-2"
            >
              {chain.logoUrl && (
                <img src={chain.logoUrl} alt={ chain.name} className="w-4 h-4 rounded-full" />
              )}
              <span>{chain.name} ({chain.type})</span>
              
            </SelectItem>
          ))}
        </SelectContent>
    </Select>

      <Input
        placeholder="Contract address"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value)
          handleTrySubmit(abi, e.target.value)
        }}
      />

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {fileName ? (
          <p className="text-sm text-green-600">✅ {fileName} Uploaded</p>
        ) : (
          <p className="text-sm text-gray-500">
            Drag the ABI `.json` file here or click to select
          </p>
        )}
      </div>
    </div>
  )
}
