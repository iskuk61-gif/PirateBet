import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { address as bitcoinAddress } from 'bitcoinjs-lib';

export function deriveLTCAddress(xpub: string, userIndex: number): string {
  const root = bip32.fromBase58(xpub);
  const child = root.derivePath(`m/0/${userIndex}`);
  return bitcoinAddress.toBase58Check(Buffer.from(child.identifier), 0x30); // LTC mainnet
}

export function deriveSOLKeypair(seed: string, userIndex: number): { publicKey: string; keypair: Keypair } {
  const mnemonic = seed;
  const seed2 = bip39.mnemonicToSeedSync(mnemonic);
  const path = `m/44'/501'/${userIndex}'/0'`;
  const derivedSeed = derivePath(path, seed2.toString('hex')).key;
  const keypair = Keypair.fromSecretKey(Buffer.concat([derivedSeed, derivedSeed]));
  return { publicKey: keypair.publicKey.toBase58(), keypair };
}
