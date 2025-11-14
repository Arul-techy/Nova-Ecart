import Link from "next/link";
import { redirect } from "next/navigation";
import SignInForm from "./sign-in-form";
import { createClient } from "@/lib/supabase/server";

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const redirectTo =
    typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : "/";
  const message =
    typeof resolvedSearchParams?.message === "string"
      ? resolvedSearchParams.message
      : undefined;
  const friendlyMessage =
    message === "missing_code"
      ? "We couldn’t complete the sign in. Please try again."
      : message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back to NovaEcart
          </h1>
          <p className="text-sm text-slate-600">
            Continue with Google to resume shopping on NovaEcart.
          </p>
        </div>
        {friendlyMessage ? (
          <p className="mb-6 rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            {friendlyMessage}
          </p>
        ) : null}
        <SignInForm redirectTo={redirectTo} />
        <p className="mt-8 text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 transition hover:text-indigo-500"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}

