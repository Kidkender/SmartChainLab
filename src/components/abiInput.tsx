import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHAIN_LIST } from "@/data/ChainList";
import type { AbiItem, IdlInstruction } from "@/interfaces/function.type";
import type { ChainInfo } from "@/interfaces/network.type";
import { isSolanaAddress } from "@/utils/address";
import { extractABI, extractIDL } from "@/utils/artifactParser";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";

export function AbiInput({
  onSubmit,
}: {
  onSubmit: (
    abiOrIdl: AbiItem[] | IdlInstruction[],
    address: string,
    chain: ChainInfo
  ) => void;
}) {
  const [abiOrIdl, setAbiOrIdl] = useState<AbiItem[] | IdlInstruction[] | null>(
    null
  );
  const [fileName, setFileName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [chainType, setChainType] = useState<string>("");

  const handleTrySubmit = (
    nextAbiOrIdl: AbiItem[] | IdlInstruction[] | null,
    nextAddress: string,
    nextChainType: string
  ) => {
    const found = CHAIN_LIST.find((c) => c.type.toString() === nextChainType);

    if (!nextAbiOrIdl || !found) return;
    if (nextChainType === "evm" && /^0x[a-fA-F0-9]{40}$/.test(nextAddress)) {
      onSubmit(nextAbiOrIdl, nextAddress, found);
    }
    if (nextChainType === "solana" && isSolanaAddress(nextAddress)) {
      onSubmit(nextAbiOrIdl, nextAddress, found);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        if (chainType === "evm") {
          const abiParsed = extractABI(raw);
          setAbiOrIdl(abiParsed.abi as AbiItem[]);
          setFileName(file.name);
          handleTrySubmit(abiParsed.abi as AbiItem[], address, chainType);
        } else if (chainType === "solana") {
          const idlParsed = extractIDL(raw);
          setAbiOrIdl(idlParsed.instructions);
          setFileName(file.name);
          handleTrySubmit(idlParsed.instructions, address, chainType);
        }
      } catch (err) {
        alert((err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/json": [".json"] },
    multiple: false,
    onDrop: (files) => {
      const file = files[0];
      if (file) handleFile(file);
    },
  });

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          const found = CHAIN_LIST.find((c) => c.chainId.toString() === value);
          setChainType(found?.type || "");
          setAbiOrIdl(null);
          setFileName("");
          setAddress("");
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select network" />
        </SelectTrigger>
        <SelectContent>
          {CHAIN_LIST.map((chain) => (
            <SelectItem
              key={chain.chainId.toString()}
              value={chain.chainId.toString()}
              className="flex items-center gap-2"
            >
              {chain.logoUrl && (
                <img
                  src={chain.logoUrl}
                  alt={chain.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span>
                {chain.name} ({chain.type})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder={
          chainType === "solana" ? "Program address" : "Contract address"
        }
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          handleTrySubmit(abiOrIdl, e.target.value, chainType);
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
            {chainType === "solana"
              ? "Drag the IDL .json file here or click to select"
              : "Drag the ABI .json file here or click to select"}
          </p>
        )}
      </div>
    </div>
  );
}
