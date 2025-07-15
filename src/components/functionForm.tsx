import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/viemClient";
import { useState } from "react";

export function FunctionForm({ fn, address }: { fn: any, address: string }) {
    const [args, setArgs] = useState<string[]>([]);
    const [result, setResult] = useState<string>("");

    const handleCall = async () => {
        try {
            const res = await client.readContract({
                address: address as `0x${string}`,
                abi: [fn],
                functionName: fn.name,
                args: args
            })
            setResult(JSON.stringify(res, (_, v) =>
                typeof v === "bigint" ? v.toString() : v
            ))
        } catch (error) {
            setResult("❌ Error: " + (error as Error).message)

        }
    }
    
    return (
        <div className="p-4 border rounded space-y-2">
            <h3 className="font-semibold"> {fn.name}</h3>
            {fn.inputs.map((input: any, i: number) => (
                <Input key={i}
                    placeholder={`${input.name} (${input.type})`}
                    onChange={(e) => {
                        const newArgs = [...args]
                        newArgs[i] = e.target.value
                        setArgs(newArgs)
                    }}
                />
            ))}
            <Button onClick={handleCall}> Call</Button>
            {result && <div className="text-sm text-muted-foreground">Result: { result}</div>}
        </div>
    )
}