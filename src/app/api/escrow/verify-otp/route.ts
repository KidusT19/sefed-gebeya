import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { escrowId, otp, type } = body as {
      escrowId: string;
      otp: string;
      type: "MERCHANT_RELEASE" | "CUSTOMER_DELIVERY";
    };

    if (!escrowId || !otp || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: escrowId, otp, type" },
        { status: 400 }
      );
    }

    // In production, verify cryptographic OTP from DB or Redis
    // For demo purposes, any 4-digit or 6-digit numeric OTP is validated
    if (!/^\d{4,6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP format. Must be 4 to 6 numeric digits." },
        { status: 400 }
      );
    }

    if (type === "MERCHANT_RELEASE") {
      return NextResponse.json({
        success: true,
        escrowId,
        type: "MERCHANT_RELEASE",
        status: "PICKED_UP_BY_BAJAJ",
        message: "Merchant release verified. Goods transferred to driver. In transit to destination kebele.",
        timestamp: new Date().toISOString(),
      });
    }

    if (type === "CUSTOMER_DELIVERY") {
      return NextResponse.json({
        success: true,
        escrowId,
        type: "CUSTOMER_DELIVERY",
        status: "FUNDS_RELEASED_TO_SELLER",
        message: "Customer delivery verified upon physical inspection. Escrow funds transferred to merchant wallet via Telebirr / CBE Birr.",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: false, error: "Unknown OTP verification type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
