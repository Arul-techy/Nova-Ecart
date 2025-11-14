"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpWithGoogle } from "@/app/(auth)/actions";

const initialState: string | undefined = undefined;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      disabled={pending}
    >
      {pending ? "Redirecting…" : "Create account with Google"}
    </button>
  );
}

type SignUpFormProps = {
  redirectTo?: string;
};

export default function SignUpForm({ redirectTo }: SignUpFormProps) {
  const [errorMessage, formAction] = useActionState(
    signUpWithGoogle,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
      <div className="space-y-3 text-center text-sm text-slate-600">
        <p>Use your Google account to get started with NovaEcart.</p>
        <p className="text-xs text-slate-500">
          You&apos;ll be redirected to Google to confirm your account, then we&apos;ll bring you back
          here.
        </p>
      </div>
      {errorMessage ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}
      <SubmitButton />
      <p className="text-xs text-slate-500">
        By continuing you agree to our terms of service and privacy policy.
      </p>
    </form>
  );
}

