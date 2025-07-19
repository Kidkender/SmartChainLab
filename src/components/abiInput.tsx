import { Input } from "@/components/ui/input";
import { CHAIN_LIST } from "@/data/ChainList";
import type { AbiItem, IdlInstruction } from "@/interfaces/function.type";
import type { ChainInfo } from "@/interfaces/network.type";
import { isValidAddress } from "@/utils/address";
import { extractABI, extractIDL } from "@/utils/artifactParser";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export function AbiInput({
  onSubmit,
  chain,
}: {
  onSubmit: (abiOrIdl: AbiItem[] | IdlInstruction[], address: string) => void;
  chain: ChainInfo | null;
}) {
  const [abiOrIdl, setAbiOrIdl] = useState<AbiItem[] | IdlInstruction[] | null>(
    null
  );
  const [fileName, setFileName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const isDisabled = !chain;

  const handleTrySubmit = (
    nextAbiOrIdl: AbiItem[] | IdlInstruction[] | null,
    nextAddress: string,
    nextChainType: string
  ) => {
    const found = CHAIN_LIST.find((c) => c.type.toString() === nextChainType);

    if (!nextAbiOrIdl || !found) return;
    if (nextChainType === "evm" && isValidAddress(nextAddress, nextChainType)) {
      onSubmit(nextAbiOrIdl, nextAddress);
    }
    if (
      nextChainType === "solana" &&
      isValidAddress(nextAddress, nextChainType)
    ) {
      onSubmit(nextAbiOrIdl, nextAddress);
    }
  };

  const handleFile = (file: File) => {
    if (!chain) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);
        if (chain.type === "evm") {
          const abiParsed = extractABI(raw);
          setAbiOrIdl(abiParsed.abi as AbiItem[]);
          setFileName(file.name);
          handleTrySubmit(abiParsed.abi as AbiItem[], address, chain.type);
        } else if (chain.type === "solana") {
          const idlParsed = extractIDL(raw);
          setAbiOrIdl(idlParsed.instructions);
          setFileName(file.name);
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

  const handleGenerate = () => {
    if (!abiOrIdl || !address || !chain) return;
    onSubmit(abiOrIdl, address);
  };

  return (
    <div className="relative">
      <div className="space-y-4">
        <Input
          placeholder={
            chain?.type === "solana" ? "Program address" : "Contract address"
          }
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          disabled={isDisabled}
        />

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Input {...getInputProps()} disabled={isDisabled} />
          {fileName ? (
            <p className="text-sm text-green-600">✅ {fileName} Uploaded</p>
          ) : (
            <p className="text-sm text-gray-500">
              {chain?.type === "solana"
                ? "Drag the IDL .json file here or click to select"
                : "Drag the ABI .json file here or click to select"}
            </p>
          )}
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded w-full"
          onClick={handleGenerate}
          disabled={!abiOrIdl || !address || !chain}
        >
          Generate
        </button>
      </div>

      {!chain && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 rounded bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🌐</span>
            <span className="text-lg font-semibold text-gray-700 mb-1">
              Please select a network first
            </span>
            <span className="text-sm text-gray-500">
              You need to choose a network before loading ABI/IDL.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
