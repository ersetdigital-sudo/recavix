import type { SecondIdKind } from "@/types";

/** Nilai bawaan kalau sebuah game belum mengatur kolom ID-nya sendiri. */
export const DEFAULT_ID_LABEL = "User ID";
export const DEFAULT_SECOND_LABEL = "Zone ID";

/** Jenis kolom ID kedua yang didukung form checkout. */
export const SECOND_ID_KINDS: SecondIdKind[] = ["none", "text", "select"];

/** Label yang ditampilkan di editor game admin untuk tiap jenis kolom. */
export const SECOND_ID_KIND_LABEL: Record<SecondIdKind, string> = {
  none: "Tidak ada — cukup satu kolom",
  text: "Isian bebas",
  select: "Pilihan (dropdown)",
};

export const isSecondIdKind = (value: unknown): value is SecondIdKind =>
  typeof value === "string" && (SECOND_ID_KINDS as string[]).includes(value);

export interface IdFields {
  idLabel: string;
  secondKind: SecondIdKind;
  secondLabel: string;
  secondOptions: string[];
}

/** Pilihan boleh datang sebagai array (data seed) atau teks berkoma (form/DB). */
export function parseSecondOptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

/** Kebalikannya: array pilihan disimpan sebagai teks berkoma di satu kolom. */
export const stringifySecondOptions = (options: string[]): string => options.join(", ");

/**
 * Normalkan konfigurasi kolom ID checkout.
 *
 * Dipakai bersama oleh data bawaan, baris database, dan payload dari dashboard
 * supaya ketiganya menghasilkan bentuk yang sama — form checkout tidak pernah
 * menerima label kosong atau jenis kolom yang tidak dikenal.
 */
export function readIdFields(source: {
  idLabel?: unknown;
  secondKind?: unknown;
  secondLabel?: unknown;
  secondOptions?: unknown;
}): IdFields {
  const idLabel =
    typeof source.idLabel === "string" && source.idLabel.trim()
      ? source.idLabel.trim()
      : DEFAULT_ID_LABEL;

  const secondKind = isSecondIdKind(source.secondKind) ? source.secondKind : "none";

  const secondLabel =
    typeof source.secondLabel === "string" && source.secondLabel.trim()
      ? source.secondLabel.trim()
      : DEFAULT_SECOND_LABEL;

  // Pilihan hanya relevan untuk jenis "select".
  const secondOptions = secondKind === "select" ? parseSecondOptions(source.secondOptions) : [];

  return { idLabel, secondKind, secondLabel, secondOptions };
}
