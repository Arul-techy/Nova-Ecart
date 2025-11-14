"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithGoogle, signInWithEmail } from "@/app/(auth)/actions";
import { useState } from "react";

const initialState: string | undefined = undefined;

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
      disabled={pending}
    >
      {pending ? "Processing…" : text}
    </button>
  );
}

type SignInFormProps = {
  redirectTo?: string;
};

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const [mode, setMode] = useState<"google" | "email">("email");
  const [googleError, googleAction] = useActionState(signInWithGoogle, initialState);
  const [emailError, emailAction] = useActionState(signInWithEmail, initialState);

  if (mode === "google") {
    return (
      <div className="space-y-6">
        <form action={googleAction} className="space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
          <div className="space-y-3 text-center text-sm text-slate-600">
            <p>Sign in securely with your Google account.</p>
            <p className="text-xs text-slate-500">
              We&apos;ll redirect you to Google to complete authentication.
            </p>
          </div>
          {googleError ? (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {googleError}
            </p>
          ) : null}
          <SubmitButton text="Continue with Google" />
        </form>
        <button
          type="button"
          onClick={() => setMode("email")}
          className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          Or sign in with email instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form action={emailAction} className="space-y-6">
        <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        {emailError ? (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {emailError}
          </p>
        ) : null}
        
        <SubmitButton text="Sign in with Email" />
      </form>
      <button
        type="button"
        onClick={() => setMode("google")}
        className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
      >
        Or continue with Google
      </button>
    </div>
  );
}

