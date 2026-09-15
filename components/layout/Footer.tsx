import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/ui/Logo";
import { helpLinks, mainNav, site } from "@/data/site";

interface FooterProps {
  /** `full` = sitemap footer, `slim` = single-line checkout footer. */
  variant?: "full" | "slim";
}

export function Footer({ variant = "full" }: FooterProps) {
  if (variant === "slim") {
    return (
      <footer className="border-t border-peach bg-peach-2 text-sm">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
          <Logo size={26} />
          <span className="opacity-75">
            Butuh bantuan?{" "}
            <a className="underline" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
          </span>
        </Container>
      </footer>
    );
  }

  return (
    <footer className="border-t border-peach bg-peach-2 text-sm">
      <Container className="grid gap-6 py-8 sm:grid-cols-3">
        <div>
          <Logo size={28} className="mb-2" />
          <p className="opacity-75">
            Top up diamond, gems, dan voucher game favoritmu. Proses otomatis 24
            jam, harga termurah.
          </p>
        </div>
        <nav aria-label="Menu footer">
          <div className="mb-2 font-bold">Menu</div>
          <ul className="space-y-1 opacity-80">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <div className="mb-2 font-bold">Bantuan</div>
          <ul className="space-y-1 opacity-80">
            <li>
              <a
                href={`mailto:${site.contact.email}`}
                className="hover:underline"
              >
                {site.contact.email}
              </a>
            </li>
            {helpLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
