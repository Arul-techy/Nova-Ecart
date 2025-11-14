"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithGoogle } from "@/app/(auth)/actions";

const initialState: string | undefined = undefined;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      disabled={pending}
    >
      {pending ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}

type SignInFormProps = {
  redirectTo?: string;
};

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const [errorMessage, formAction] = useActionState(
    signInWithGoogle,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
      <div className="space-y-3 text-center text-sm text-slate-600">
        <p>Sign in securely with your Google account.</p>
        <p className="text-xs text-slate-500">
          We&apos;ll redirect you to Google to complete authentication, then bring you back to
          NovaEcart.
        </p>
      </div>
      {errorMessage ? (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}

