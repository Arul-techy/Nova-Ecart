import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, amount, currency = "USDT" } = body;

    if (!productId || !amount) {
      return NextResponse.json(
        { error: "Product ID and amount are required" },
        { status: 400 }
      );
    }

    // Cryptomus API configuration
    const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
    const apiKey = process.env.CRYPTOMUS_API_KEY;
    const cryptomusUrl = process.env.CRYPTOMUS_API_URL || "https://api.cryptomus.com/v1";

    if (!merchantId || !apiKey) {
      console.error("Cryptomus credentials not configured");
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 500 }
      );
    }

    // Create payment request
    const paymentData = {
      amount: amount.toString(),
      currency: currency,
      order_id: `order_${productId}_${Date.now()}`,
      url_return: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/store?payment=success`,
      url_callback: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/cryptomus/callback`,
      is_payment_multiple: false,
      lifetime: 7200, // 2 hours
      to_currency: currency,
    };

    // Generate signature for Cryptomus API
    const payload = JSON.stringify(paymentData);
    const sign = createHash("md5")
      .update(Buffer.from(payload).toString("base64") + apiKey)
      .digest("hex");

    const response = await fetch(`${cryptomusUrl}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "merchant": merchantId,
        "sign": sign,
      },
      body: payload,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      console.error("Cryptomus API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create payment", details: errorData },
        { status: response.status }
      );
    }

    const paymentResult = await response.json();
    return NextResponse.json(paymentResult);
  } catch (error) {
    console.error("Cryptomus payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

