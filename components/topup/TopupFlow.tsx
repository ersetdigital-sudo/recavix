"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";

import { DiamondPackGrid } from "@/components/topup/DiamondPackGrid";
import { OrderSummary } from "@/components/topup/OrderSummary";
import { PaymentMethodGrid } from "@/components/topup/PaymentMethodGrid";
import { StepCard } from "@/components/topup/StepCard";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/cn";
import { GAME_IMAGE_FALLBACK } from "@/lib/media";
import { createCheckoutOrder } from "@/lib/orders/actions";
import type { CatalogGame, CatalogPack, PaymentMethod, PromoCode } from "@/types";

interface TopupFlowProps {
  /** Game yang boleh dipilih di checkout — sudah disaring dari katalog aktif. */
  games: CatalogGame[];
  /** Game yang langsung terpilih saat halaman dibuka (dari `?game=` di URL). */
  initialGameSlug?: string;
  /** Paket diamond aktif per slug game — harga tiap game diatur sendiri di dashboard. */
  packsByGame: Record<string, CatalogPack[]>;
  /** Metode pembayaran aktif. */
  methods: PaymentMethod[];
  /**
   * Kode promo aktif. Dikirim server supaya pembeli melihat diskonnya lebih
   * dulu; server tetap menghitung ulang dan memvalidasi saat pesanan dibuat.
   */
  promos: PromoCode[];
}

export function TopupFlow({
  games,
  initialGameSlug,
  packsByGame,
  methods,
  promos,
}: TopupFlowProps) {
  const router = useRouter();

  const [gameSlug, setGameSlug] = useState(initialGameSlug || games[0]?.slug || "");
  const [uid, setUid] = useState("");
  const [zone, setZone] = useState("");
  const [packIndex, setPackIndex] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const game = games.find((item) => item.slug === gameSlug) ?? games[0];
  // Nominal mengikuti game yang dipilih — tiap game punya daftar paketnya sendiri.
  const packs = packsByGame[game.slug] ?? [];
  const pack = packIndex === null ? null : packs[packIndex];
  const payment = methods.find((method) => method.id === paymentId) ?? null;

  const basePrice = pack?.price ?? 0;
  const discount = Math.round(basePrice * discountRate);
  const total = Math.max(0, basePrice - discount);
  const account = uid ? `${uid}${zone ? ` (${zone})` : ""}` : "-";

  const contact = useMemo(
    () => [whatsapp.trim(), email.trim()].filter(Boolean).join(" / "),
    [whatsapp, email],
  );

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promos.find((promo) => promo.code.toUpperCase() === code);

    if (found) {
      setAppliedCode(found.code);
      setDiscountRate(found.discount);
      setPromoMessage({ ok: true, text: `Kode berhasil dipakai — diskon ${found.discount * 100}%.` });
      return;
    }

    setAppliedCode("");
    setDiscountRate(0);
    setPromoMessage({ ok: false, text: "Kode promo tidak valid." });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uid.trim()) {
      setError(`Masukkan ${game.idLabel} akun game kamu dulu.`);
      return;
    }
    if (game.secondKind !== "none" && !zone.trim()) {
      setError(`${game.secondLabel} wajib diisi dulu ya.`);
      return;
    }
    if (!pack || packIndex === null) {
      setError("Pilih nominal diamond dulu ya.");
      return;
    }
    if (!paymentId) {
      setError("Pilih metode pembayaran dulu ya.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await createCheckoutOrder({
        gameSlug: game.slug,
        // Hanya id paket yang dikirim — harga dicari server dari database.
        packId: pack.id,
        accountId: uid,
        zoneId: zone,
        contact,
        paymentMethodId: paymentId,
        promoCode: appliedCode,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.push(`/pembayaran/${encodeURIComponent(result.invoice)}`);
    });
  };

  return (
    <div>
      <div className="card-shadow mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-mint-2 bg-white p-4">
        <Image
          src={game.image || GAME_IMAGE_FALLBACK}
          alt={`Ikon game ${game.name}`}
          width={72}
          height={72}
          className="h-[72px] w-[72px] flex-none rounded-xl bg-mint object-cover"
        />
        <div className="min-w-0">
          <h1 className="text-[24px] font-extrabold leading-tight">{game.name}</h1>
          <p className="flex flex-wrap items-center gap-2 text-sm opacity-75">
            <span>Proses otomatis 24 jam</span>
            <StarRating value={game.rating} />
            <span>· {game.platform}</span>
          </p>
        </div>
        <div className="ml-auto hidden sm:block">
          <label htmlFor="game-select" className="sr-only">
            Pilih game
          </label>
          <select
            id="game-select"
            value={gameSlug}
            onChange={(event) => {
              const next = event.target.value;
              setGameSlug(next);
              // Nominal dan kolom ID kedua milik game sebelumnya tidak berlaku lagi.
              setPackIndex(null);
              setZone("");
              // URL ikut berubah supaya game yang sedang dilihat bisa dibagikan
              // dan tidak balik ke game pertama saat halaman dimuat ulang.
              router.replace(`/topup?game=${encodeURIComponent(next)}`, { scroll: false });
            }}
            className="field max-w-[220px]"
          >
            {games.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form
        className="grid items-start gap-6 lg:grid-cols-[1fr_320px]"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <StepCard step={1} title="Masukkan Data Akun">
            {/*
              Kolomnya beda per game dan datang dari katalog: Mobile Legends &
              Magic Chess butuh User ID + Zone ID, Genshin Impact UID + pilihan
              Server, PUBG/Free Fire/Roblox cukup satu kolom.
            */}
            <div
              className={cn(
                "grid gap-4",
                game.secondKind === "none" ? "sm:max-w-[340px]" : "sm:grid-cols-2",
              )}
            >
              <div>
                <label htmlFor="uid" className="mb-1.5 block text-[13px] font-semibold">
                  {game.idLabel}
                </label>
                <input
                  id="uid"
                  className="field"
                  placeholder={`Masukkan ${game.idLabel}`}
                  value={uid}
                  onChange={(event) => setUid(event.target.value)}
                  required
                />
              </div>

              {game.secondKind !== "none" ? (
                <div>
                  <label htmlFor="zone" className="mb-1.5 block text-[13px] font-semibold">
                    {game.secondLabel}
                  </label>
                  {game.secondKind === "select" ? (
                    <select
                      id="zone"
                      className="field"
                      value={zone}
                      onChange={(event) => setZone(event.target.value)}
                      required
                    >
                      <option value="">Pilih {game.secondLabel}</option>
                      {game.secondOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="zone"
                      className="field"
                      placeholder={`Masukkan ${game.secondLabel}`}
                      value={zone}
                      onChange={(event) => setZone(event.target.value)}
                      required
                    />
                  )}
                </div>
              ) : null}
            </div>
            <p className="mt-3 text-xs opacity-65">
              {game.idLabel}
              {game.secondKind !== "none" ? ` dan ${game.secondLabel}` : ""} bisa dilihat di
              dalam game.
            </p>
          </StepCard>

          <StepCard step={2} title="Pilih Nominal Diamond">
            {packs.length === 0 ? (
              <p className="text-sm opacity-70">
                Nominal untuk game ini belum tersedia. Pilih game lain dulu.
              </p>
            ) : (
              <DiamondPackGrid packs={packs} selectedIndex={packIndex} onSelect={setPackIndex} />
            )}
          </StepCard>

          <StepCard step={3} title="Metode Pembayaran">
            <PaymentMethodGrid methods={methods} selectedId={paymentId} onSelect={setPaymentId} />
          </StepCard>

          <StepCard step={4} title="Kontak & Kode Promo">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="wa" className="mb-1.5 block text-[13px] font-semibold">
                  No. WhatsApp
                </label>
                <input
                  id="wa"
                  type="tel"
                  className="field"
                  placeholder="08xxxxxxxxxx"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold">
                  Email (opsional)
                </label>
                <input
                  id="email"
                  type="email"
                  className="field"
                  placeholder="kamu@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <label htmlFor="promo" className="sr-only">
                Kode promo
              </label>
              <input
                id="promo"
                className="field"
                placeholder="Kode promo, mis. GEMS10"
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
              />
              <button
                type="button"
                onClick={applyPromo}
                className="whitespace-nowrap rounded-xl border-2 border-green-d px-4 text-sm font-semibold transition-colors hover:bg-mint"
              >
                Pakai
              </button>
            </div>

            {promoMessage && (
              <p
                role="status"
                className={cn("mt-2 text-xs", promoMessage.ok ? "text-green-d" : "text-coral")}
              >
                {promoMessage.text}
              </p>
            )}
          </StepCard>
        </div>

        <OrderSummary
          gameName={game.name}
          account={account}
          itemLabel={pack ? `${pack.diamonds} Diamond` : "Belum dipilih"}
          paymentLabel={payment?.name ?? "Belum dipilih"}
          discount={discount}
          total={total}
          error={error}
          pending={pending}
        />
      </form>
    </div>
  );
}
