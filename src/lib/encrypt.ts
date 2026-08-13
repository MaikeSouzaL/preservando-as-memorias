import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const hex = process.env.BANK_DATA_ENCRYPTION_KEY ?? "";
  if (hex.length !== 64) {
    throw new Error(
      "BANK_DATA_ENCRYPTION_KEY deve ter exatamente 64 caracteres hex (32 bytes). " +
      "Gere com: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return Buffer.from(hex, "hex");
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Format: iv(24 hex) + tag(32 hex) + ciphertext(hex)
  return iv.toString("hex") + tag.toString("hex") + encrypted.toString("hex");
}

export function decrypt(encoded: string): string {
  const key = getKey();
  const iv = Buffer.from(encoded.slice(0, 24), "hex");
  const tag = Buffer.from(encoded.slice(24, 56), "hex");
  const ciphertext = Buffer.from(encoded.slice(56), "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext) + decipher.final("utf8");
}
