import { HeaderBar } from "@/components/layout/HeaderBar";
import { getSiteContent } from "@/lib/content/store";

interface HeaderProps {
  /** Render the game search field (home page). */
  showSearch?: boolean;
}

/**
 * Header situs.
 *
 * Server component tipis yang mengambil nama brand dan menu dari dashboard,
 * lalu menyerahkannya ke bagian klien (`HeaderBar`) yang butuh `usePathname`
 * untuk menandai menu aktif.
 */
export async function Header({ showSearch = false }: HeaderProps) {
  const content = await getSiteContent();

  return (
    <HeaderBar
      brandName={content.settings.name}
      nav={content.navigation.header}
      showSearch={showSearch}
    />
  );
}
