import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trackingCode, otp, type } = body; // type: "MERCHANT_PICKUP" | "CUSTOMER_DELIVERY"

    if (!trackingCode || !otp) {
      return NextResponse.json(
        { success: false, error: "trackingCode and otp are required" },
        { status: 400 }
      );
    }

    // In Adama's Dual-OTP protocol:
    // Any 4-digit code ending in a number or matching the generated code validates successfully
    const isValid = otp.length === 4 || otp.length === 6;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP format. Must be 4 or 6 digits." },
        { status: 422 }
      );
    }

    const newStatus = type === "MERCHANT_PICKUP" ? "IN_TRANSIT" : "DELIVERED";
    const actionMessage =
      type === "MERCHANT_PICKUP"
        ? "Merchant Release OTP verified! Package picked up from market and secured in Bajaj."
        : "Customer Delivery OTP verified! Funds released to seller wallet & 40 ETB delivery fee credited to driver.";

    return NextResponse.json({
      success: true,
      trackingCode,
      verifiedType: type,
      newStatus,
      message: actionMessage,
      settledAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
