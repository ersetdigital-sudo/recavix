"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/ui/Logo";
import { mainNav } from "@/data/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface HeaderProps {
  /** Render the game search field (home page). */
  showSearch?: boolean;
}

export function Header({ showSearch = false }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header className="relative bg-peach">
      <Container className="flex flex-wrap items-center gap-3 py-3">
        <Logo />

        {showSearch && (
          <form
            action="/games"
            role="search"
            className="order-3 w-full sm:order-none sm:w-auto sm:max-w-[320px] sm:flex-1"
          >
            <label htmlFor="site-search" className="sr-only">
              Cari game
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Search game..."
              className="w-full rounded-lg border border-line bg-white/80 px-3 py-1.5 text-sm outline-none focus:border-green"
            />
          </form>
        )}

        <nav
          aria-label="Navigasi utama"
          className="ml-auto hidden items-center gap-5 text-sm font-medium md:flex"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "transition-colors hover:text-green-d",
                isActive(pathname, item.href) && "font-bold text-coral-dark",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-4">
          <Link
            href="#"
            className="rounded-lg border-2 border-green-d px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-mint"
          >
            Log In
          </Link>
          <Link
            href="#"
            className="rounded-lg bg-green-d px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-green-dd"
          >
            Sign Up
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            className="grid h-9 w-9 place-items-center rounded-lg border-2 border-green-d text-lg leading-none text-green-d md:hidden"
          >
            <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              aria-label="Navigasi mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="order-last w-full overflow-hidden md:hidden"
            >
              <ul className="mt-1 flex flex-col gap-1 border-t border-line pt-3 text-sm font-medium">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      className={cn(
                        "block rounded-lg px-3 py-2",
                        isActive(pathname, item.href)
                          ? "bg-white/70 font-bold text-coral-dark"
                          : "hover:bg-white/50",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
