import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/admin/actions";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/AdminSidebar";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { getSiteContent } from "@/lib/content/store";
import { isAuthEnabled, isAuthorized } from "@/lib/admin/auth";

/** Dashboard harus selalu membaca data terbaru, bukan hasil prerender saat build. */
export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

const ACTION_BUTTON =
  "inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-mint-2 bg-white px-3.5 py-2 text-xs font-bold transition-colors";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthEnabled()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="card-shadow w-full max-w-md rounded-2xl border border-line bg-white p-6">
          <h1 className="font-display text-lg font-extrabold text-coral">Dashboard terkunci</h1>
          <p className="mt-2 text-sm leading-relaxed opacity-80">
            <b>ADMIN_PASSWORD belum di-set</b> di server ini. Dashboard sengaja menolak akses
            daripada terbuka untuk umum. Set variabel itu di environment, lalu muat ulang halaman ini.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-bold text-green-d underline underline-offset-4"
          >
            Kembali ke situs
          </Link>
        </div>
      </main>
    );
  }

  if (!(await isAuthorized())) redirect("/admin/login");

  const { settings } = await getSiteContent();

  return (
    <div className="lg:flex">
      <AdminSidebar brandName={settings.name} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-mint-2 bg-cream/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-2 px-4 lg:px-8">
            <div className="mr-auto lg:hidden">
              <LogoMark size={28} />
            </div>
            <div className="mr-auto hidden lg:block">
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-50">
                Panel Admin
              </p>
              <p className="text-sm font-extrabold text-green-dd">{settings.name}</p>
            </div>

            <Link
              href="/"
              target="_blank"
              className={`${ACTION_BUTTON} opacity-80 hover:border-green hover:text-green-d`}
            >
              <Icon name="external" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lihat situs</span>
            </Link>

            <form action={logoutAction}>
              <button
                type="submit"
                className={`${ACTION_BUTTON} opacity-80 hover:border-line hover:text-coral`}
              >
                <Icon name="logout" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </header>

        <AdminMobileNav />

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1120px] space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
