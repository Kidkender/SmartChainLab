import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


export function AbiInput({ onLoad }: { onLoad: (abi: any[], address: string) => void }) {
    const [address, setAddress] = useState<string>("");

    const [abiRaw, setAbiRaw] = useState<string>("");

    const handleLoad = () => {
        try {
            const abi = JSON.parse(abiRaw)
            onLoad(abi, address)
        } catch (error) {
            console.log("Abi invalid")
        }
    }

    return (
        <div className="space-y-2">
            <Input placeholder="Contract address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <Textarea placeholder="Paste ABI JSON" value={abiRaw} onChange={(e) => setAbiRaw(e.target.value)} />
            
            <Button onClick={handleLoad} > Load ABI</Button>
        </div>
    )
}