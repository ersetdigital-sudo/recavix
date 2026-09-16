import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { isAuthEnabled, isAuthorized } from "@/lib/admin/auth";
import { getSiteContent } from "@/lib/content/store";

export const metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Tanpa ADMIN_PASSWORD tidak ada yang bisa dimasukkan — arahkan ke halaman
  // yang menjelaskan supaya tidak terjadi redirect bolak-balik.
  if (!isAuthEnabled()) redirect("/admin");

  // Sudah punya sesi valid tidak perlu melihat form lagi.
  if (await isAuthorized()) redirect("/admin");

  const { settings } = await getSiteContent();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-6">
      {/* Cahaya lembut dari atas: bikin card terasa mengambang di atas grid background. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_75%_at_50%_0%,rgba(143,192,138,0.32),transparent_68%)]"
      />

      <div className="card-shadow relative w-full max-w-[420px] rounded-2xl border border-mint-2 bg-white p-6 sm:p-8">
        <Logo name={settings.name} size={34} />

        <h1 className="mt-5 font-display text-xl font-extrabold leading-tight text-green-dd sm:text-[22px]">
          Dashboard Admin
        </h1>
        <p className="mb-6 mt-1.5 text-sm leading-relaxed opacity-70">
          Masukkan password admin untuk melanjutkan.
        </p>

        <LoginForm />

        <p className="mt-6 border-t border-mint-2 pt-4 text-center text-xs opacity-70">
          <Link
            href="/"
            className="font-semibold underline underline-offset-4 transition-colors hover:text-green-d"
          >
            Kembali ke situs
          </Link>
        </p>
      </div>
    </main>
  );
}
