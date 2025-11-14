import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const bucket = "product-images";
    const expires = 60 * 5; // 5 minutes

    // Prefer using a service role key for signed URLs
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return NextResponse.json({ error: "Supabase URL not configured" }, { status: 500 });
    }

    let signedUrl: string | null = null;

    if (serviceKey) {
      const supabase = createSupabaseClient(supabaseUrl, serviceKey);
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expires);
      if (error || !data) {
        console.error("createSignedUrl error:", error);
      } else {
        signedUrl = data.signedUrl;
      }
    } else {
      // Fallback: attempt to use server-side SSR client (may fail if not allowed)
      try {
        const serverModule = await import("@/lib/supabase/server");
        const supabase = await serverModule.createClient();
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expires);
        if (!error && data) {
          signedUrl = data.signedUrl;
        } else {
          console.error("server createSignedUrl error:", error);
        }
      } catch (err) {
        console.error("signed url fallback failed:", err);
      }
    }

    if (!signedUrl) {
      return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 502 });
    }

    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error("/api/image error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
