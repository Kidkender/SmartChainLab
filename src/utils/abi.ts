export function extractABI(json: any) {

    // Hardhat artifact
    if (Array.isArray(json?.abi)) {
        return {
            abi: json.abi,
            contractName: json.contractName
        }
    }

    // Truffle artifact
    if (Array.isArray(json?.abiDefinition)) {
        return { abi: json.abiDefinition, contractName: json.contractName }
    }
    // Remix compilation output
    if (json?.compilerOutput?.abi) {
        return { abi: json.compilerOutput.abi, contractName: json.contractName }
    }
    // Foundry/artifact combined file
    if (json?.contracts) {
        const names = Object.keys(json.contracts)
        if (names.length === 1) {
            const c = json.contracts[names[0]]
            return { abi: c.abi, contractName: names[0] }
        }
        throw new Error("Multiple contracts found – hãy chọn contract cụ thể.")
    }
    // Original array
    if (Array.isArray(json)) {
        return { abi: json }
    }
    throw new Error("Not found abi in file")
}