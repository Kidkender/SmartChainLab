// Type for EVM
export type AbiItem = { type: string; name?: string; [key: string]: unknown };
// Type for Solana
export type IdlAccount = { name: string; isMut: boolean; isSigner: boolean };
export type IdlArg = { name: string; type: unknown };
export type IdlInstruction = {
  name: string;
  accounts: IdlAccount[];
  args: IdlArg[];
};
