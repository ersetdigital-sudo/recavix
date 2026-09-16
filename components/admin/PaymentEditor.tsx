"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

import { Icon } from "@/components/ui/Icon";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { cn } from "@/lib/cn";
import { PAYMENT_TYPE_LABEL, isPaymentMethodReady } from "@/lib/payments/shared";
import type { ActionResult, PaymentMethod, PaymentType } from "@/types";

const SMALL =
  "rounded-lg border-[1.5px] border-mint-2 bg-white px-2.5 py-1.5 text-xs font-bold opacity-75 transition-colors hover:opacity-100 disabled:opacity-30";

const ADD_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-green bg-white px-4 py-2 text-xs font-bold text-green-d transition-colors hover:bg-mint";

interface PaymentEditorProps {
  methods: PaymentMethod[];
  action: (methods: PaymentMethod[]) => Promise<ActionResult>;
}

const blankMethod = (): PaymentMethod => ({
  id: `metode-${Date.now().toString(36)}`,
  name: "",
  color: "#4f7a4a",
  code: "NEW",
  type: "transfer",
  accountLabel: "Nomor Tujuan",
  accountNumber: "",
  accountName: "",
  qrImage: "",
  logo: "",
  instructions: [],
  isActive: true,
  sortOrder: 0,
});

export function PaymentEditor({ methods, action }: PaymentEditorProps) {
  const [draft, setDraft] = useState<PaymentMethod[]>(methods);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (id: string, patch: Partial<PaymentMethod>) => {
    setDraft((current) =>
      current.map((method) => (method.id === id ? { ...method, ...patch } : method)),
    );
    setStatus(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    const copy = [...draft];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved as PaymentMethod);
    setDraft(copy);
    setStatus(null);
  };

  const activeCount = draft.filter((method) => method.isActive).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="mr-auto text-xs opacity-70">
          <b>{activeCount}</b> dari {draft.length} metode aktif. Hanya metode aktif yang muncul di
          halaman pembayaran pembeli.
        </p>
        <button
          type="button"
          onClick={() => {
            const created = blankMethod();
            setDraft((current) => [...current, created]);
            setEditingId(created.id);
            setStatus(null);
          }}
          className="rounded-xl bg-green-d px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-green-dd"
        >
          + Tambah metode
        </button>
      </div>

      {status ? (
        <p
          role="status"
          className={cn(
            "card-shadow rounded-2xl border-[1.5px] px-4 py-3.5 text-xs font-semibold",
            status.ok
              ? "border-green bg-mint text-green-dd"
              : "border-line bg-peach-2 text-coral-dark",
          )}
        >
          {status.message}
        </p>
      ) : null}

      <ul className="space-y-3">
        {draft.map((method, index) => {
          const editing = editingId === method.id;
          const ready = isPaymentMethodReady(method);

          return (
            <li
              key={method.id}
              className={cn(
                "card-shadow overflow-hidden rounded-2xl border-[1.5px] bg-white",
                editing ? "border-green" : "border-mint-2",
              )}
            >
              <div className="flex flex-wrap items-center gap-3 border-b border-mint-2 bg-mint/40 px-5 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border-[1.5px] border-mint-2 bg-white">
                  {method.logo ? (
                    <Image
                      src={method.logo}
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="grid h-full w-full place-items-center text-[10px] font-extrabold text-white"
                      style={{ backgroundColor: method.color }}
                    >
                      {method.code}
                    </span>
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">
                    {method.name || "(nama belum diisi)"}
                  </p>
                  <p className="text-[11px] opacity-60">{PAYMENT_TYPE_LABEL[method.type]}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border-[1.5px] px-2.5 py-0.5 text-[10px] font-bold",
                      method.isActive
                        ? "border-green bg-mint text-green-dd"
                        : "border-mint-2 bg-mint/40 opacity-70",
                    )}
                  >
                    {method.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  {method.isActive && !ready ? (
                    <span className="inline-flex items-center gap-1 rounded-full border-[1.5px] border-amber bg-white px-2.5 py-0.5 text-[10px] font-bold text-amber">
                      <Icon name="clock" className="h-3 w-3" />
                      Belum lengkap
                    </span>
                  ) : null}
                </div>

                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Naikkan"
                    className={SMALL}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === draft.length - 1}
                    aria-label="Turunkan"
                    className={SMALL}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(editing ? null : method.id)}
                    className="rounded-lg border-[1.5px] border-green bg-white px-3 py-1.5 text-xs font-bold text-green-d transition-colors hover:bg-mint"
                  >
                    {editing ? "Tutup" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraft((current) => current.filter((entry) => entry.id !== method.id));
                      if (editing) setEditingId(null);
                      setStatus(null);
                    }}
                    className="rounded-lg border-[1.5px] border-line bg-white px-3 py-1.5 text-xs font-bold text-coral transition-colors hover:bg-peach-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {editing ? (
                <div className="space-y-4 px-5 py-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="block text-xs font-bold">Nama metode pembayaran</span>
                      <input
                        value={method.name}
                        onChange={(event) => update(method.id, { name: event.target.value })}
                        placeholder="Contoh: Transfer BCA"
                        className="field"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="block text-xs font-bold">Tipe pembayaran</span>
                      <select
                        value={method.type}
                        onChange={(event) => {
                          const type = event.target.value as PaymentType;
                          update(method.id, {
                            type,
                            accountLabel:
                              type === "qris"
                                ? method.accountLabel || "QRIS"
                                : method.accountLabel === "QRIS"
                                  ? "Nomor Tujuan"
                                  : method.accountLabel,
                          });
                        }}
                        className="field"
                      >
                        <option value="qris">QRIS / Scan QR</option>
                        <option value="transfer">Transfer Bank / E-Wallet</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="block text-xs font-bold">Warna chip</span>
                      <input
                        type="color"
                        value={method.color}
                        onChange={(event) => update(method.id, { color: event.target.value })}
                        className="h-[42px] w-full rounded-xl border-[1.5px] border-mint-2 bg-white px-1"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="block text-xs font-bold">Kode chip</span>
                      <input
                        value={method.code}
                        onChange={(event) => update(method.id, { code: event.target.value })}
                        placeholder="BCA"
                        maxLength={4}
                        className="field"
                      />
                    </label>
                  </div>

                  {method.type === "qris" ? (
                    <div className="space-y-1">
                      <span className="block text-xs font-bold">
                        Gambar QRIS <span className="text-coral">*</span>
                      </span>
                      <ImageUploadField
                        value={method.qrImage}
                        onChange={(url) => update(method.id, { qrImage: url })}
                        placeholder="Upload gambar QR dari aplikasi bank/e-wallet"
                      />
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="space-y-1">
                        <span className="block text-xs font-bold">Label nomor</span>
                        <input
                          value={method.accountLabel}
                          onChange={(event) =>
                            update(method.id, { accountLabel: event.target.value })
                          }
                          placeholder="Nomor Virtual Account BCA"
                          className="field"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-xs font-bold">
                          Nomor rekening / e-wallet <span className="text-coral">*</span>
                        </span>
                        <input
                          value={method.accountNumber}
                          onChange={(event) =>
                            update(method.id, { accountNumber: event.target.value })
                          }
                          placeholder="1234567890"
                          className="field"
                        />
                      </label>
                      <label className="space-y-1">
                        <span className="block text-xs font-bold">Nama pemilik rekening</span>
                        <input
                          value={method.accountName}
                          onChange={(event) =>
                            update(method.id, { accountName: event.target.value })
                          }
                          placeholder="PT Recavix Digital"
                          className="field"
                        />
                      </label>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="block text-xs font-bold">
                      Logo bank / e-wallet <span className="font-normal opacity-60">(opsional)</span>
                    </span>
                    <ImageUploadField
                      value={method.logo}
                      onChange={(url) => update(method.id, { logo: url })}
                      placeholder="Upload logo supaya pembeli lebih mudah mengenali"
                    />
                  </div>

                  <label className="flex items-start gap-2.5 rounded-xl border-[1.5px] border-mint-2 bg-mint/30 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={method.isActive}
                      onChange={(event) => update(method.id, { isActive: event.target.checked })}
                      className="chk mt-0.5"
                    />
                    <span className="text-xs font-bold">
                      Aktifkan metode ini
                      <span className="block font-normal opacity-70">
                        {!ready
                          ? "Lengkapi datanya dulu — kalau belum, metode ini otomatis dinonaktifkan saat disimpan."
                          : "Metode nonaktif tidak muncul di halaman pembayaran."}
                      </span>
                    </span>
                  </label>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">Langkah cara bayar</span>
                      <span className="text-[11px] opacity-60">
                        Kosongkan untuk memakai langkah bawaan sesuai tipe.
                      </span>
                    </div>
                    {method.instructions.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2">
                        <span className="w-4 text-xs font-bold opacity-50">{stepIndex + 1}</span>
                        <input
                          value={step}
                          onChange={(event) =>
                            update(method.id, {
                              instructions: method.instructions.map((entry, position) =>
                                position === stepIndex ? event.target.value : entry,
                              ),
                            })
                          }
                          placeholder="Contoh: Buka aplikasi m-banking kamu."
                          className="field"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            update(method.id, {
                              instructions: method.instructions.filter(
                                (_, position) => position !== stepIndex,
                              ),
                            })
                          }
                          className="rounded-lg border-[1.5px] border-line bg-white px-2.5 py-1.5 text-xs font-bold text-coral hover:bg-peach-2"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        update(method.id, { instructions: [...method.instructions, ""] })
                      }
                      className={ADD_BUTTON}
                    >
                      + Tambah langkah
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="card-shadow sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border-[1.5px] border-mint-2 bg-cream/95 px-5 py-4 backdrop-blur">
        <p className="mr-auto text-xs opacity-70">Perubahan baru berlaku setelah disimpan.</p>
        <button
          type="button"
          onClick={() =>
            startTransition(async () => {
              const result = await action(draft);
              setStatus(result);
              if (result.ok) setEditingId(null);
            })
          }
          disabled={pending}
          className="rounded-xl bg-green-d px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-green-dd disabled:opacity-60"
        >
          {pending ? "Menyimpan..." : "Simpan metode pembayaran"}
        </button>
      </div>
    </div>
  );
}
