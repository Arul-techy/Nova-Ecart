"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signUpWithGoogle, signUpWithEmail } from "@/app/(auth)/actions";
import { useState, useEffect } from "react";

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

type SignUpFormProps = {
  redirectTo?: string;
};

export default function SignUpForm({ redirectTo }: SignUpFormProps) {
  const [mode, setMode] = useState<"google" | "email">("email");
  const [googleError, googleAction] = useActionState(signUpWithGoogle, initialState);
  const [emailError, emailAction] = useActionState(signUpWithEmail, initialState);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (emailError === "success") {
      setSuccess(true);
    }
  }, [emailError]);

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          <p className="font-semibold">Check your email!</p>
          <p className="mt-1">We sent you a confirmation link. Click it to activate your account.</p>
        </div>
      </div>
    );
  }

  if (mode === "google") {
    return (
      <div className="space-y-6">
        <form action={googleAction} className="space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
          <div className="space-y-3 text-center text-sm text-slate-600">
            <p>Use your Google account to get started with NovaEcart.</p>
            <p className="text-xs text-slate-500">
              You&apos;ll be redirected to Google to confirm your account.
            </p>
          </div>
          {googleError ? (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
              {googleError}
            </p>
          ) : null}
          <SubmitButton text="Create account with Google" />
          <p className="text-xs text-slate-500 text-center">
            By continuing you agree to our terms of service and privacy policy.
          </p>
        </form>
        <button
          type="button"
          onClick={() => setMode("email")}
          className="w-full text-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          Or create account with email instead
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form action={emailAction} className="space-y-6">
        <input type="hidden" name="redirectTo" value={redirectTo ?? "/"} />
        
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
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="At least 6 characters"
            />
            <p className="mt-1 text-xs text-slate-500">Must be at least 6 characters</p>
          </div>
        </div>

        {emailError && emailError !== "success" ? (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {emailError}
          </p>
        ) : null}
        
        <SubmitButton text="Create account with Email" />
        
        <p className="text-xs text-slate-500 text-center">
          By continuing you agree to our terms of service and privacy policy.
        </p>
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
