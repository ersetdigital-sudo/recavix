"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string, meta?: { width: number; height: number }) => void;
  placeholder?: string;
}

/**
 * Input gambar dengan tombol upload ke Cloudinary (unsigned preset).
 *
 * Unggahan dikirim langsung dari browser ke Cloudinary, jadi file tidak lewat
 * server kita. Karena unsigned, API secret tidak dipakai sama sekali — yang
 * dibutuhkan hanya cloud name dan nama preset.
 */
export function ImageUploadField({ value, onChange, placeholder }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

  const handleFile = async (file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Format harus PNG, JPG, atau WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Ukuran maksimal 2 MB, file ini ${(file.size / 1048576).toFixed(1)} MB.`);
      return;
    }
    if (!configured) {
      setError("Upload belum dikonfigurasi. Hubungi pengembang.");
      return;
    }

    setPending(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body },
      );
      const data = (await response.json()) as {
        secure_url?: string;
        width?: number;
        height?: number;
        error?: { message?: string };
      };

      if (!response.ok || !data.secure_url) {
        throw new Error(data.error?.message ?? "Upload gagal. Coba lagi.");
      }

      onChange(data.secure_url, {
        width: data.width ?? 0,
        height: data.height ?? 0,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload gagal. Coba lagi.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border-[1.5px] border-mint-2 bg-mint">
          {value ? (
            <Image
              src={value}
              alt=""
              width={64}
              height={64}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <Icon name="image" className="h-5 w-5 opacity-40" />
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder ?? "https://... atau /images/namafile.png"}
            className="field"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={pending || !configured}
              className="inline-flex items-center gap-1.5 rounded-xl bg-green-d px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-green-dd disabled:opacity-50"
            >
              {pending ? "Mengunggah..." : "Upload gambar"}
            </button>

            {value ? (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  onChange("");
                }}
                className="rounded-xl border-[1.5px] border-line bg-white px-3.5 py-2 text-xs font-bold text-coral transition-colors hover:bg-peach-2"
              >
                Hapus
              </button>
            ) : null}

            {!configured ? (
              <span className="text-[11px] font-semibold text-amber">
                Upload belum dikonfigurasi
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className={cn("hidden")}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error ? (
        <p role="alert" className="text-[11px] font-bold text-coral">
          {error}
        </p>
      ) : (
        <p className="text-[11px] opacity-60">PNG, JPG, atau WebP. Maksimal 2 MB.</p>
      )}
    </div>
  );
}
