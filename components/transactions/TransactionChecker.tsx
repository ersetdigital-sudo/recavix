"use client";

import { useState, type FormEvent } from "react";

import { SectionCard } from "@/components/ui/SectionCard";
import { TransactionDetail } from "@/components/transactions/TransactionDetail";
import { TransactionNotFound } from "@/components/transactions/TransactionNotFound";
import { site } from "@/data/site";
import { demoInvoiceIds, transactions } from "@/data/transactions";
import type { Transaction } from "@/types";

type CheckResult =
  | { kind: "found"; transaction: Transaction }
  | { kind: "missing"; invoiceId: string }
  | null;

export function TransactionChecker() {
  const [invoiceId, setInvoiceId] = useState("");
  const [result, setResult] = useState<CheckResult>(null);

  const check = (rawId: string) => {
    const id = rawId.trim().toUpperCase();
    const found = transactions[id];
    setResult(
      found
        ? { kind: "found", transaction: found }
        : { kind: "missing", invoiceId: id },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    check(invoiceId);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
      <SectionCard className="lg:sticky lg:top-6">
        <h1 className="text-[24px] font-extrabold leading-tight">
          Lacak Pesanan Kamu
        </h1>
        <p className="mb-4 mt-1 text-sm opacity-75">
          Masukkan Invoice ID yang kami kirim lewat WhatsApp atau email setelah
          kamu top up.
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="invoice-id"
              className="mb-1.5 block text-[13px] font-semibold"
            >
              Invoice ID
            </label>
            <input
              id="invoice-id"
              className="field"
              placeholder="TG-2026-0001"
              autoComplete="off"
              value={invoiceId}
              onChange={(event) => setInvoiceId(event.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="invoice-contact"
              className="mb-1.5 block text-[13px] font-semibold"
            >
              No. WhatsApp / Email
            </label>
            <input
              id="invoice-contact"
              className="field"
              placeholder="08xxxxxxxxxx"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-green-d py-3 font-display text-lg font-bold text-white transition-colors hover:bg-green-dd"
          >
            Cek Status
          </button>
        </form>

        <p className="mb-2 mt-4 text-xs opacity-70">Coba contoh invoice:</p>
        <div className="flex flex-wrap gap-2">
          {demoInvoiceIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setInvoiceId(id);
                check(id);
              }}
              className="rounded-full border-[1.5px] border-mint-2 bg-white px-2.5 py-1 text-xs transition-colors hover:border-green"
            >
              {id}
            </button>
          ))}
        </div>

        <div className="mt-5 border-t border-mint-2 pt-4 text-xs opacity-75">
          Pesanan belum masuk lebih dari 15 menit? Hubungi{" "}
          <a className="underline" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
        </div>
      </SectionCard>

      <section aria-live="polite">
        {result === null && (
          <div className="card-shadow rounded-2xl border border-peach bg-peach-2 p-8 text-center">
            <div aria-hidden className="mb-2 text-4xl">
              🔎
            </div>
            <h2 className="text-[20px] font-extrabold">
              Belum ada transaksi ditampilkan
            </h2>
            <p className="mt-1 text-sm opacity-75">
              Masukkan Invoice ID di sebelah kiri untuk melihat status pesanan.
            </p>
          </div>
        )}

        {result?.kind === "found" && (
          <TransactionDetail transaction={result.transaction} />
        )}

        {result?.kind === "missing" && (
          <TransactionNotFound invoiceId={result.invoiceId} />
        )}
      </section>
    </div>
  );
}
