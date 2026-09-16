"use client";

import { useState, useTransition, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ActionResult } from "@/types";

import { ImageUploadField } from "./ImageUploadField";

export type { ActionResult };

export interface FieldDef {
  /** Mendukung dot-path untuk objek bersarang, mis. "contact.email". */
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "toggle" | "image";
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  /** Field yang butuh lebar penuh, mis. textarea. */
  wide?: boolean;
  /**
   * Untuk field gambar: nama field tetangga yang diisi otomatis dari ukuran file
   * hasil upload, supaya lebarnya tidak perlu diketik manual.
   */
  sizeFields?: { width: string; height: string };
}

type AnyRecord = Record<string, unknown>;

export function getPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((acc, key) => (acc as AnyRecord | undefined)?.[key], source);
}

function setPath(source: AnyRecord, path: string, value: unknown): AnyRecord {
  const [head, ...rest] = path.split(".");
  if (!head) return source;
  if (rest.length === 0) return { ...source, [head]: value };
  return {
    ...source,
    [head]: setPath((source[head] as AnyRecord | undefined) ?? {}, rest.join("."), value),
  };
}

const SMALL_BUTTON =
  "rounded-lg border-[1.5px] border-mint-2 bg-white px-2.5 py-1.5 text-xs font-bold opacity-75 transition-colors disabled:opacity-30";

const ADD_BUTTON =
  "mt-4 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-green bg-white px-4 py-2 text-xs font-bold text-green-d transition-colors hover:bg-mint";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown, meta?: { width: number; height: number }) => void;
}) {
  if (field.type === "image") {
    return (
      <ImageUploadField
        value={typeof value === "string" ? value : ""}
        placeholder={field.placeholder}
        onChange={(url, meta) => onChange(url, meta)}
      />
    );
  }

  if (field.type === "toggle") {
    return (
      <label className="flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="chk mt-0.5"
        />
        <span className="font-semibold">{field.help ?? "Aktif"}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        className="field"
      >
        {(field.options ?? []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="field"
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        placeholder={field.placeholder}
        className="field"
      />
    );
  }

  return (
    <input
      type="text"
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      className="field"
    />
  );
}

export function FieldGrid({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: AnyRecord;
  onChange: (name: string, next: unknown) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((field) => (
        <div
          key={field.name}
          className={cn(
            "space-y-1",
            (field.wide || field.type === "textarea" || field.type === "image") && "sm:col-span-2",
          )}
        >
          <label className="block text-xs font-bold">{field.label}</label>
          <FieldInput
            field={field}
            value={getPath(values, field.name)}
            onChange={(next, meta) => {
              onChange(field.name, next);
              // Ukuran file hasil upload langsung mengisi field lebar/tinggi.
              if (meta && field.sizeFields && meta.width > 0) {
                onChange(field.sizeFields.width, meta.width);
                onChange(field.sizeFields.height, meta.height);
              }
            }}
          />
          {field.help && field.type !== "toggle" ? (
            <p className="text-[11px] opacity-60">{field.help}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="card-shadow overflow-hidden rounded-2xl border border-mint-2 bg-white">
      <header className="border-b border-mint-2 bg-mint/40 px-5 py-4">
        <h2 className="font-display text-[17px] font-extrabold text-green-dd">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed opacity-70">{description}</p>
        ) : null}
      </header>
      <div className="px-5 py-5">{children}</div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-mint-2 bg-mint/30 px-5 py-3">
        {footer}
      </footer>
    </section>
  );
}

export function SaveButton({ pending, label = "Simpan" }: { pending: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-green-d px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-dd disabled:opacity-60"
    >
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

export function StatusText({ status }: { status: ActionResult | null }) {
  if (!status) return null;
  return (
    <span
      role="status"
      className={cn("text-xs font-semibold", status.ok ? "text-green-d" : "text-coral")}
    >
      {status.message}
    </span>
  );
}

/**
 * Editor daftar teks sederhana (mis. langkah "Cara Top Up").
 * Aksi menerima array apa adanya — tidak ada pembungkus patch, jadi tipenya
 * tetap jelas di sisi server action.
 */
export function StringListEditor({
  title,
  description,
  initialItems,
  action,
  placeholder,
  addLabel = "Tambah baris",
  submitLabel,
}: {
  title: string;
  description?: string;
  initialItems: string[];
  action: (items: string[]) => Promise<ActionResult>;
  placeholder?: string;
  addLabel?: string;
  submitLabel?: string;
}) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved ?? "");
    setItems(copy);
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(items)));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
          </>
        }
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 text-xs font-bold opacity-50">{index + 1}</span>
              <input
                value={item}
                onChange={(event) => {
                  setItems((current) =>
                    current.map((entry, position) =>
                      position === index ? event.target.value : entry,
                    ),
                  );
                  setStatus(null);
                }}
                placeholder={placeholder}
                className="field"
              />
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Naikkan"
                className={SMALL_BUTTON}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Turunkan"
                className={SMALL_BUTTON}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => {
                  setItems((current) => current.filter((_, position) => position !== index));
                  setStatus(null);
                }}
                aria-label="Hapus"
                className={cn(SMALL_BUTTON, "border-line text-coral hover:bg-peach-2")}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current, ""]);
            setStatus(null);
          }}
          className={ADD_BUTTON}
        >
          + {addLabel}
        </button>
      </Panel>
    </form>
  );
}

/** Form untuk satu objek datar (mendukung dot-path untuk properti bersarang). */
export function ObjectEditor<T extends object>({
  title,
  description,
  fields,
  initial,
  action,
  submitLabel,
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  initial: T;
  action: (value: T) => Promise<ActionResult>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<AnyRecord>(initial as AnyRecord);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const handleChange = (name: string, next: unknown) => {
    setValues((current) => setPath(current, name, next));
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(values as unknown as T)));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
          </>
        }
      >
        <FieldGrid fields={fields} values={values} onChange={handleChange} />
      </Panel>
    </form>
  );
}

/** Editor daftar: tambah, hapus, geser naik/turun, lalu simpan sekaligus. */
export function RepeatableEditor<T extends object>({
  title,
  description,
  fields,
  initialItems,
  emptyItem,
  action,
  titleField,
  titlePrefix = "Item",
  addLabel = "Tambah item",
  submitLabel,
  emptyLabel = "Belum ada item.",
}: {
  title: string;
  description?: string;
  fields: FieldDef[];
  initialItems: T[];
  /** Template untuk item baru. Dikirim sebagai data karena fungsi tidak bisa lewat batas server/client. */
  emptyItem: T;
  action: (items: T[]) => Promise<ActionResult>;
  /** Nama field yang dipakai sebagai judul tiap baris. */
  titleField?: string;
  titlePrefix?: string;
  addLabel?: string;
  submitLabel?: string;
  emptyLabel?: string;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const labelFor = (item: T, index: number) => {
    const value = titleField ? getPath(item, titleField) : null;
    const text = typeof value === "string" && value.trim() ? value : null;
    return `${titlePrefix} ${index + 1}${text ? ` — ${text}` : ""}`;
  };

  const updateItem = (index: number, name: string, next: unknown) => {
    setItems((current) =>
      current.map((item, position) =>
        position === index
          ? (setPath(item as unknown as AnyRecord, name, next) as T)
          : item,
      ),
    );
    setStatus(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      const [moved] = copy.splice(index, 1);
      copy.splice(target, 0, moved as T);
      return copy;
    });
    setStatus(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => setStatus(await action(items)));
      }}
    >
      <Panel
        title={title}
        description={description}
        footer={
          <>
            <SaveButton pending={pending} label={submitLabel} />
            <StatusText status={status} />
            <span className="ml-auto text-[11px] opacity-60">{items.length} item</span>
          </>
        }
      >
        {items.length === 0 ? (
          <p className="text-xs opacity-60">{emptyLabel}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl border-[1.5px] border-mint-2 bg-mint/30 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xs font-extrabold">{labelFor(item, index)}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Naikkan"
                      className={SMALL_BUTTON}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Turunkan"
                      className={SMALL_BUTTON}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setItems((current) => current.filter((_, position) => position !== index));
                        setStatus(null);
                      }}
                      aria-label="Hapus"
                      className={cn(SMALL_BUTTON, "border-line text-coral hover:bg-peach-2")}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <FieldGrid
                  fields={fields}
                  values={item as unknown as AnyRecord}
                  onChange={(name, next) => updateItem(index, name, next)}
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setItems((current) => [...current, structuredClone(emptyItem)]);
            setStatus(null);
          }}
          className={ADD_BUTTON}
        >
          + {addLabel}
        </button>
      </Panel>
    </form>
  );
}
