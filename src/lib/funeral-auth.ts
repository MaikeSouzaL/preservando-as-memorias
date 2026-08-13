import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";

export type FuneralSession = {
  funeralHomeId: string;
  email: string;
  name: string;
};

/** Validade da sessão da funerária. Depois disso é preciso logar de novo. */
const MAX_AGE_SECONDS = 60 * 60 * 12;

type SignedPayload = FuneralSession & { iat: number };

function getSecret(): string {
  const secret = process.env.FUNERAL_SESSION_SECRET;

  // Falha fechada: sem segredo não existe sessão válida. Nunca cair num
  // valor padrão — era exatamente isso que tornava o cookie forjável.
  if (!secret || secret.length < 32) {
    throw new Error(
      "FUNERAL_SESSION_SECRET ausente ou curto demais (mínimo 32 caracteres). " +
        `Gere um com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }

  return secret;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function getFuneralSession(): Promise<FuneralSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("funeral_session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    // Formato: <payload base64url>.<assinatura HMAC>
    const [encodedPayload, signature] = decodeURIComponent(sessionCookie.value).split(".");

    if (!encodedPayload || !signature) return null;
    if (!safeEqual(signature, sign(encodedPayload))) return null;

    const payload: SignedPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    );

    if (!payload?.funeralHomeId || !payload?.email) return null;

    const ageSeconds = (Date.now() - payload.iat) / 1000;
    if (!Number.isFinite(ageSeconds) || ageSeconds < 0 || ageSeconds > MAX_AGE_SECONDS) {
      return null;
    }

    return {
      funeralHomeId: payload.funeralHomeId,
      email: payload.email,
      name: payload.name || "",
    };
  } catch {
    return null;
  }
}

export function serializeFuneralSession(session: FuneralSession): string {
  const payload: SignedPayload = { ...session, iat: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");

  return encodeURIComponent(`${encoded}.${sign(encoded)}`);
}

/** Usado só pelo script de setup para sugerir um segredo. */
export function generateSessionSecret(): string {
  return randomBytes(32).toString("hex");
}
