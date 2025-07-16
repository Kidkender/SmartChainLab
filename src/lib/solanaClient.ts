import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Keypair,
} from "@solana/web3.js";

export function getConnection(clusterUrl: string) {
  return new Connection(clusterUrl, "confirmed");
}

export async function sendTransaction({
  connection,
  instructions,
  payer,
  signers = [],
}: {
  connection: Connection;
  instructions: TransactionInstruction[];
  payer: Keypair;
  signers?: Keypair[];
}) {
  const tx = new Transaction().add(...instructions);
  const txid = await sendAndConfirmTransaction(connection, tx, [
    payer,
    ...signers,
  ]);
  return txid;
}

export function createInstruction({
  programId,
  keys,
  data,
}: {
  programId: string;
  keys: { pubkey: string; isSigner: boolean; isWritable: boolean }[];
  data: Buffer;
}) {
  return new TransactionInstruction({
    programId: new PublicKey(programId),
    keys: keys.map((k) => ({
      pubkey: new PublicKey(k.pubkey),
      isSigner: k.isSigner,
      isWritable: k.isWritable,
    })),
    data,
  });
}
