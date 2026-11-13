import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mock Telegram Bot dispatcher
    console.log("Telegram Bot Webhook Event Received:", body);

    // If message contains /start or /status
    const text = body?.message?.text || "";
    const chatId = body?.message?.chat?.id;

    let responseMessage = "Welcome to Sebez Market Bot! Send /runs for active pooled Bajaj deliveries or /swaps for trade match updates.";

    if (text.includes("/runs")) {
      responseMessage = "🛺 Active Adama Pooled Runs:\n1. Arada -> Bole (2:30 PM, 4/6 booked, 40 ETB)\n2. Amede -> Kebele 04 (4:45 PM, 3/6 booked, 45 ETB)";
    } else if (text.includes("/swaps")) {
      responseMessage = "🔄 Sebez Circular Barter Loop #301:\nAll 3 traders in Adama have approved! Courier Abebe D. (Bajaj 3-B042) is dispatched.";
    }

    return NextResponse.json({
      ok: true,
      chatId,
      dispatchedText: responseMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Invalid webhook payload" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    bot: "@SebezMarketBot",
    description: "Low-data dispatch gateway for Adama Bajaj drivers and barter traders",
  });
}
