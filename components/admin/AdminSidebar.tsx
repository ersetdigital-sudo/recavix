"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Ringkasan", icon: "dashboard" },
  { href: "/admin/pesanan", label: "Pesanan", icon: "receipt" },
  { href: "/admin/katalog", label: "Katalog", icon: "gamepad" },
  { href: "/admin/paket", label: "Paket Diamond", icon: "gem" },
  { href: "/admin/pembayaran", label: "Pembayaran", icon: "card" },
  { href: "/admin/banner", label: "Banner Hero", icon: "image" },
  { href: "/admin/ulasan", label: "Ulasan & FAQ", icon: "star" },
  { href: "/admin/promo", label: "Promo", icon: "tag" },
  { href: "/admin/identitas", label: "Identitas & Navigasi", icon: "sliders" },
];

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

const ITEM_BASE =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors";

/** Panel navigasi vertikal untuk layar besar. */
export function AdminSidebar({ brandName }: { brandName: string }) {
  const pathname = usePathname() ?? "";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-mint-2 bg-white lg:flex">
      <div className="border-b border-mint-2 px-5 py-5">
        <div className="flex items-center gap-2">
          <LogoMark size={30} />
          <span className="font-display text-[21px] font-extrabold leading-none text-green-d">
            {brandName}
          </span>
        </div>
        <p className="mt-2 text-[11px] font-bold tracking-wide opacity-50">Panel Admin</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label, icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                ITEM_BASE,
                active
                  ? "bg-mint text-green-dd ring-1 ring-inset ring-green"
                  : "opacity-70 hover:bg-mint hover:opacity-100",
              )}
            >
              <Icon name={icon} className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-mint-2 p-3">
        <Link href="/" target="_blank" className={cn(ITEM_BASE, "opacity-70 hover:bg-mint")}>
          <Icon name="external" className="h-4 w-4 shrink-0" />
          Lihat situs
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className={cn(ITEM_BASE, "w-full opacity-70 hover:bg-peach-2 hover:text-coral")}
          >
            <Icon name="logout" className="h-4 w-4 shrink-0" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}

/** Strip navigasi horizontal yang hanya tampil di layar kecil. */
export function AdminMobileNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="border-b border-mint-2 bg-white lg:hidden">
      <ul className="flex gap-2 overflow-x-auto px-4 py-3">
        {NAV.map(({ href, label, icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition-colors",
                  active
                    ? "bg-green-d text-white"
                    : "border-[1.5px] border-mint-2 opacity-80 hover:bg-mint",
                )}
              >
                <Icon name={icon} className="h-3.5 w-3.5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
