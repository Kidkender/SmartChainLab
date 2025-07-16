import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChainInfo } from "@/interfaces/network.type";
import {
  createInstruction,
  getConnection,
  sendTransaction,
} from "@/lib/solanaClient";
import { client as evmClient } from "@/lib/viemClient";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";

export function FunctionForm({
  fn,
  address,
  chain,
}: {
  fn: any;
  address: string;
  chain: ChainInfo;
}) {
  const [args, setArgs] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  // const secret = Uint8Array.from([]);
  // const payer = Keypair.fromSecretKey(secret);

  const handleCall = async () => {
    if (chain.type === "evm") {
      try {
        const res = await evmClient.readContract({
          address: address as `0x${string}`,
          abi: [fn],
          functionName: fn.name,
          args: args,
        });
        setResult(
          JSON.stringify(res, (_, v) =>
            typeof v === "bigint" ? v.toString() : v
          )
        );
      } catch (error) {
        setResult("❌ Error: " + (error as Error).message);
      }
    } else if (chain.type === "solana") {
      try {
        const connection = getConnection(chain.rpcUrl!);
        const instruction = createInstruction({
          programId: address,
          keys: fn.accounts.map((acc: any) => ({
            pubkey: acc.pubkey,
            isSigner: acc.isSigner,
            isWritable: acc.isMut,
          })),
          data: Buffer.from([]),
        });

        const txid = await sendTransaction({
          connection,
          instructions: [instruction],
          payer,
        });
        console.log("txid", txid);
        setResult("✅ Tx sent: " + txid);
      } catch (error) {
        setResult("❌ Error: " + (error as Error).message);
      }
    }
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <h3 className="font-semibold"> {fn.name}</h3>
      {(fn.inputs ?? fn.args ?? []).map((input: any, i: number) => (
        <Input
          key={i}
          placeholder={`${input.name} (${input.type})`}
          onChange={(e) => {
            const newArgs = [...args];
            newArgs[i] = e.target.value;
            setArgs(newArgs);
          }}
        />
      ))}

      <Button onClick={handleCall}> Call</Button>
      {result && (
        <div className="text-sm text-muted-foreground">Result: {result}</div>
      )}
    </div>
  );
}
