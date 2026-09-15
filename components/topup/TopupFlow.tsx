"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";

import { DiamondPackGrid } from "@/components/topup/DiamondPackGrid";
import { OrderSuccess } from "@/components/topup/OrderSuccess";
import { OrderSummary } from "@/components/topup/OrderSummary";
import { PaymentMethodGrid } from "@/components/topup/PaymentMethodGrid";
import { StepCard } from "@/components/topup/StepCard";
import { StarRating } from "@/components/ui/StarRating";
import { diamondPacks } from "@/data/diamond-packs";
import { checkoutGames } from "@/data/games";
import { paymentMethods, promoCodes } from "@/data/payment-methods";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { formatRupiah } from "@/lib/format";

export function TopupFlow() {
  const [gameSlug, setGameSlug] = useState(checkoutGames[0].slug);
  const [uid, setUid] = useState("");
  const [zone, setZone] = useState("");
  const [packIndex, setPackIndex] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const game =
    checkoutGames.find((item) => item.slug === gameSlug) ?? checkoutGames[0];
  const pack = packIndex === null ? null : diamondPacks[packIndex];
  const payment = paymentMethods.find((method) => method.id === paymentId) ?? null;

  const basePrice = pack?.price ?? 0;
  const discount = Math.round(basePrice * discountRate);
  const total = Math.max(0, basePrice - discount);
  const account = uid ? `${uid}${zone ? ` (${zone})` : ""}` : "-";

  const summaryText = useMemo(() => {
    if (!pack || !payment) return "";
    return `${pack.diamonds} Diamond untuk ID ${uid}${
      zone ? ` (${zone})` : ""
    } • ${payment.name} • Total ${formatRupiah(
      total,
    )}. Instruksi pembayaran dikirim ke WhatsApp kamu.`;
  }, [pack, payment, uid, zone, total]);

  const whatsappHref = `https://wa.me/${
    site.contact.whatsapp
  }?text=${encodeURIComponent(
    `Halo ${site.name}, saya sudah membuat pesanan: ${summaryText}`,
  )}`;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const found = promoCodes.find((promo) => promo.code === code);

    if (found) {
      setDiscountRate(found.discount);
      setPromoMessage({
        ok: true,
        text: `Kode berhasil dipakai — diskon ${found.discount * 100}%.`,
      });
      return;
    }

    setDiscountRate(0);
    setPromoMessage({ ok: false, text: "Kode promo tidak valid." });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!uid.trim()) {
      setError("Masukkan User ID akun game kamu dulu.");
      return;
    }
    if (packIndex === null) {
      setError("Pilih nominal diamond dulu ya.");
      return;
    }
    if (!paymentId) {
      setError("Pilih metode pembayaran dulu ya.");
      return;
    }

    setError(null);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetOrder = () => {
    setSubmitted(false);
    setPackIndex(null);
    setPaymentId(null);
    setUid("");
    setZone("");
    setWhatsapp("");
    setEmail("");
    setPromoInput("");
    setDiscountRate(0);
    setPromoMessage(null);
    setError(null);
  };

  return (
    <div>
      <div className="card-shadow mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-mint-2 bg-white p-4">
        <Image
          src={game.image}
          alt={`Ikon game ${game.name}`}
          width={72}
          height={72}
          className="h-[72px] w-[72px] flex-none rounded-xl bg-mint object-cover"
        />
        <div className="min-w-0">
          <h1 className="text-[24px] font-extrabold leading-tight">
            {game.name}
          </h1>
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
            onChange={(event) => setGameSlug(event.target.value)}
            className="field max-w-[220px]"
          >
            {checkoutGames.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {submitted ? (
        <OrderSuccess
          summary={summaryText}
          whatsappHref={whatsappHref}
          onReset={resetOrder}
        />
      ) : (
        <form
          className="grid items-start gap-6 lg:grid-cols-[1fr_320px]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <StepCard step={1} title="Masukkan Data Akun">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="uid"
                    className="mb-1.5 block text-[13px] font-semibold"
                  >
                    User ID
                  </label>
                  <input
                    id="uid"
                    className="field"
                    placeholder="Contoh: 123456789"
                    value={uid}
                    onChange={(event) => setUid(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="zone"
                    className="mb-1.5 block text-[13px] font-semibold"
                  >
                    Zone ID
                  </label>
                  <input
                    id="zone"
                    className="field"
                    placeholder="Contoh: 1234"
                    value={zone}
                    onChange={(event) => setZone(event.target.value)}
                  />
                </div>
              </div>
              <p className="mt-3 text-xs opacity-65">
                User ID &amp; Zone ID bisa dilihat di menu profil dalam game.
              </p>
            </StepCard>

            <StepCard step={2} title="Pilih Nominal Diamond">
              <DiamondPackGrid
                packs={diamondPacks}
                selectedIndex={packIndex}
                onSelect={setPackIndex}
              />
            </StepCard>

            <StepCard step={3} title="Metode Pembayaran">
              <PaymentMethodGrid
                methods={paymentMethods}
                selectedId={paymentId}
                onSelect={setPaymentId}
              />
            </StepCard>

            <StepCard step={4} title="Kontak & Kode Promo">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="wa"
                    className="mb-1.5 block text-[13px] font-semibold"
                  >
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
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[13px] font-semibold"
                  >
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
                  className={cn(
                    "mt-2 text-xs",
                    promoMessage.ok ? "text-green-d" : "text-[#b3492f]",
                  )}
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
          />
        </form>
      )}
    </div>
  );
}
