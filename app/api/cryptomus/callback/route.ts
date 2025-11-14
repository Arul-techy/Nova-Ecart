import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = process.env.CRYPTOMUS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Verify webhook signature
    const payload = JSON.stringify(body);
    const sign = createHash("md5")
      .update(Buffer.from(payload).toString("base64") + apiKey)
      .digest("hex");

    const receivedSign = request.headers.get("sign");
    if (sign !== receivedSign) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Handle payment status updates
    const { order_id, payment_status, amount } = body;

    console.log("Cryptomus callback received:", {
      order_id,
      payment_status,
      amount,
    });

    // Here you would typically:
    // 1. Update order status in your database
    // 2. Send confirmation email
    // 3. Update inventory, etc.

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Cryptomus callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

