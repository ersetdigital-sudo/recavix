import Image from "next/image";
import Link from "next/link";

import { StarRating } from "@/components/ui/StarRating";
import { GAME_IMAGE_FALLBACK } from "@/lib/media";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
  /** Show "category · platform" meta line (used on the full catalogue). */
  showMeta?: boolean;
  href?: string;
}

export function GameCard({ game, showMeta = false, href = "/topup" }: GameCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border-[1.5px] border-peach bg-white p-2.5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(79,122,74,0.18)]"
    >
      <Image
        src={game.image || GAME_IMAGE_FALLBACK}
        alt={`Ikon game ${game.name}`}
        width={320}
        height={320}
        sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 240px"
        className="aspect-square w-full rounded-xl bg-mint object-cover"
      />
      <div className="mt-2 truncate text-sm font-bold leading-tight">
        {game.name}
      </div>
      <StarRating value={game.rating} />
      {showMeta && (
        <div className="mt-0.5 text-[11px] opacity-60">
          {game.category} · {game.platform}
        </div>
      )}
      <span className="mt-2 block rounded-[9px] border-[1.5px] border-green bg-mint px-2 py-[7px] text-center text-[13px] font-semibold text-green-d transition-colors group-hover:bg-green group-hover:text-white">
        Topup Game
      </span>
    </Link>
  );
}
