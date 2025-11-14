import Link from "next/link";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";
import { createClient } from "@/lib/supabase/server";

type SearchParams =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>;

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  const resolvedSearchParams = (await searchParams) ?? {};
  const redirectTo =
    typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your NovaEcart account
          </h1>
          <p className="text-sm text-slate-600">
            Use Google to create your profile and unlock curated collections and fast delivery.
          </p>
        </div>
        <SignUpForm redirectTo={redirectTo} />
        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-indigo-600 transition hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

