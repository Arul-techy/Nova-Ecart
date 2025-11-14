import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">
            Check your inbox
          </h1>
          <p className="text-sm text-slate-600">
            We&apos;ve sent you an email with a confirmation link. Click the link to
            verify your email address and activate your NovaEcart account.
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-600">
          <p>
            Didn&apos;t receive the email? Be sure to check your spam folder or
            request another verification email from the sign in page.
          </p>
        </div>
        <Link
          href="/sign-in"
          className="inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Return to sign in
        </Link>
      </div>
    </div>
  );
}

