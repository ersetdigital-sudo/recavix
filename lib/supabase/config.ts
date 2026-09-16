/**
 * Satu tempat untuk tahu apakah penyimpanan Supabase aktif.
 *
 * Secret key hanya boleh dipakai di server. Supabase menolak secret key yang
 * datang dari konteks browser, jadi User-Agent dikirim eksplisit sebagai
 * penanda bahwa permintaan ini memang berasal dari server.
 */
const SUPABASE_USER_AGENT = "recavix-server/1.0";

const supabaseEnv = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
};

/** Error penyimpanan yang membawa kode status HTTP-nya. */
export class SupabaseError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SupabaseError";
    this.status = status;
  }
}

export const isSupabaseConfigured = () => supabaseEnv() !== null;

export function supabaseConfig() {
  const config = supabaseEnv();
  if (!config) {
    throw new Error("Penyimpanan belum dikonfigurasi di server ini.");
  }
  return config;
}

/** Header standar untuk PostgREST. Secret key hanya dipakai di server. */
export function supabaseHeaders(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "User-Agent": SUPABASE_USER_AGENT,
    ...extra,
  };
}

export async function supabaseFetch(path: string, init: RequestInit = {}) {
  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: supabaseHeaders(key, {
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) ?? {}),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200);
    // Detail teknis hanya masuk log server, tidak pernah ditampilkan di UI.
    console.error("[penyimpanan] permintaan gagal:", response.status, detail);
    throw new SupabaseError(
      response.status,
      "Penyimpanan sedang tidak bisa diakses. Coba lagi sebentar lagi.",
    );
  }

  return response;
}
