"use client";

import { useActionState, useState } from "react";

import { loginAction } from "@/app/admin/actions";
import { Icon } from "@/components/ui/Icon";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-bold text-ink">
          Password admin
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoFocus
            autoComplete="current-password"
            aria-describedby={state && !state.ok ? "login-error" : undefined}
            className="field pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            aria-pressed={showPassword}
            className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg border border-transparent text-green-d transition-colors hover:border-mint-2 hover:bg-mint"
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      {state && !state.ok ? (
        <p
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-line bg-peach-2 px-3 py-2.5 text-xs font-semibold text-coral-dark"
        >
          <Icon name="alert" className="mt-px h-3.5 w-3.5 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-green-d px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-green-dd hover:shadow-md active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
