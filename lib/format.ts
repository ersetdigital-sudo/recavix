export const formatRupiah = (value: number): string =>
  `Rp ${value.toLocaleString("id-ID")}`;

/** Tanggal + jam, format Indonesia. Hanya dipakai di server component. */
export const formatDateTime = (value: Date | string): string =>
  new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
