import Image from "next/image";
import Link from "next/link";

import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/cn";
import { GAME_IMAGE_FALLBACK } from "@/lib/media";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
  /** Show "category · platform" meta line (used on the full catalogue). */
  showMeta?: boolean;
  /** Default: checkout dengan game ini langsung terpilih. */
  href?: string;
}

const CARD_BASE = "group block rounded-2xl border-[1.5px] border-peach bg-white p-2.5";
const CARD_READY = "transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(79,122,74,0.18)]";
const CTA_BASE = "mt-2 block rounded-[9px] px-2 py-[7px] text-center text-[13px] font-semibold";

export function GameCard({ game, showMeta = false, href }: GameCardProps) {
  // Game yang belum rilis tetap tampil supaya katalog terasa lengkap, tapi
  // kartunya tidak bisa diklik ke checkout.
  const comingSoon = game.comingSoon === true;

  // Slug dibawa lewat URL supaya checkout membuka game yang diklik. Tanpa ini
  // semua kartu mendarat di game pertama katalog.
  const target = href ?? `/topup?game=${encodeURIComponent(game.slug)}`;

  const body = (
    <>
      <div className="relative">
        <Image
          src={game.image || GAME_IMAGE_FALLBACK}
          alt={`Ikon game ${game.name}`}
          width={320}
          height={320}
          sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 240px"
          className={cn(
            "aspect-square w-full rounded-xl bg-mint object-cover",
            comingSoon && "opacity-75 saturate-[0.35]",
          )}
        />
        {comingSoon ? (
          <span className="absolute left-2 top-2 rounded-full bg-green-d px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
            Segera Hadir
          </span>
        ) : null}
      </div>

      <div className="mt-2 truncate text-sm font-bold leading-tight">{game.name}</div>
      <StarRating value={game.rating} />
      {showMeta && (
        <div className="mt-0.5 text-[11px] opacity-60">
          {game.category} · {game.platform}
        </div>
      )}
      <span
        className={cn(
          CTA_BASE,
          comingSoon
            ? "border-[1.5px] border-dashed border-green/60 bg-transparent text-green-d opacity-80"
            : "border-[1.5px] border-green bg-mint text-green-d transition-colors group-hover:bg-green group-hover:text-white",
        )}
      >
        {comingSoon ? "Segera Hadir" : "Topup Game"}
      </span>
    </>
  );

  if (comingSoon) {
    return (
      <div className={cn(CARD_BASE, "cursor-default")} aria-label={`${game.name} — segera hadir`}>
        {body}
      </div>
    );
  }

  return (
    <Link href={target} className={cn(CARD_BASE, CARD_READY)}>
      {body}
    </Link>
  );
}
