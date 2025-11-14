"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function ensureString(value: FormDataEntryValue | null) {
  if (typeof value === "string") {
    return value.trim();
  }
  return "";
}

export async function signInWithEmail(
  _prevState: string | undefined,
  formData: FormData,
) {
  const email = ensureString(formData.get("email"));
  const password = ensureString(formData.get("password"));

  if (!email || !password) {
    return "Email and password are required.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in failed:", error.message);
    return error.message;
  }

  redirect("/");
}

export async function signUpWithEmail(
  _prevState: string | undefined,
  formData: FormData,
) {
  const email = ensureString(formData.get("email"));
  const password = ensureString(formData.get("password"));

  if (!email || !password) {
    return "Email and password are required.";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Sign up failed:", error.message);
    return error.message;
  }

  return "success";
}

async function startGoogleAuth(redirectTo: string) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const authRedirect = redirectTo
    ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    : `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authRedirect,
    },
  });

  if (error) {
    console.error("Supabase Google OAuth failed:", error.message);
    return error.message;
  }

  if (!data?.url) {
    console.error("Supabase Google OAuth missing redirect URL.");
    return "Unable to start Google sign-in. Please try again.";
  }

  redirect(data.url);
}

export async function signInWithGoogle(
  _prevState: string | undefined,
  formData: FormData,
) {
  const redirectTo = ensureString(formData.get("redirectTo"));
  return startGoogleAuth(redirectTo || "/");
}

export async function signUpWithGoogle(
  _prevState: string | undefined,
  formData: FormData,
) {
  const redirectTo = ensureString(formData.get("redirectTo"));
  return startGoogleAuth(redirectTo || "/");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase sign out failed:", error.message);
    return;
  }

  redirect("/sign-in");
}

