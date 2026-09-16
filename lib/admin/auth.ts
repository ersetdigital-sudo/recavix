import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "recavix_admin";
const COOKIE_PATH = "/admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Login admin aktif hanya kalau ADMIN_PASSWORD di-set. */
export const isAuthEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

/**
 * Kunci tanda tangan sesi. Sengaja tidak punya nilai cadangan: kalau
 * ADMIN_PASSWORD kosong, auth memang tidak dipakai sama sekali.
 */
function secret() {
  const value = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD belum di-set di server ini.");
  return value;
}

/** Panjang digest selalu sama, jadi perbandingannya tidak bocor lewat timing. */
function digest(value: string) {
  return createHmac("sha256", secret()).update(value).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

function createSessionToken() {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${createHmac("sha256", secret()).update(issuedAt).digest("hex")}`;
}

function verifySessionToken(token: string | undefined) {
  if (!token) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (!safeEqual(signature, createHmac("sha256", secret()).update(issuedAt).digest("hex"))) {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age >= 0 && age < MAX_AGE_SECONDS * 1000;
}

/**
 * Fail-closed: tanpa ADMIN_PASSWORD, dashboard menolak akses alih-alih membuka
 * diri. Lebih baik terkunci karena salah konfigurasi daripada terbuka untuk umum.
 */
export async function isAuthorized() {
  if (!isAuthEnabled()) return false;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function startSession(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (!safeEqual(password, expected)) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: COOKIE_PATH,
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

/**
 * Cookie di-set dengan path `/admin`, jadi penghapusannya WAJIB menyertakan path
 * yang sama. Tanpa itu browser menyimpan cookie lama (identitas cookie adalah
 * nama + domain + path) dan tombol "Keluar" tidak benar-benar mengakhiri sesi.
 */
export async function endSession() {
  (await cookies()).delete({ name: COOKIE_NAME, path: COOKIE_PATH });
}
