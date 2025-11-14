import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("next") ?? "/";
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/sign-in?message=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?message=missing_code", requestUrl.origin),
    );
  }

  // Check for required environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase environment variables");
    return NextResponse.redirect(
      new URL("/sign-in?message=configuration_error", requestUrl.origin),
    );
  }

  const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin));

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({ name, value: "", ...options, maxAge: 0 });
          },
        },
      },
    );

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Code exchange error:", exchangeError);
      return NextResponse.redirect(
        new URL(`/sign-in?message=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin),
      );
    }

    return response;
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      new URL("/sign-in?message=authentication_failed", requestUrl.origin),
    );
  }
}

