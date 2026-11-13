import { NextResponse } from "next/server";
import { MOCK_POOLED_RUNS } from "@/data/mockData";
import { PooledRun } from "@/types/marketplace";

let dynamicRuns: PooledRun[] = [...MOCK_POOLED_RUNS];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalRuns: dynamicRuns.length,
    runs: dynamicRuns,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { runId, itemTitle, dropoffKebele, dropoffAddress, customerPhone } = body;

    const targetRun = dynamicRuns.find((r) => r.id === runId);
    if (!targetRun) {
      return NextResponse.json({ success: false, error: "Pooled run not found." }, { status: 404 });
    }

    if (targetRun.currentBooked >= targetRun.maxCapacity) {
      return NextResponse.json({ success: false, error: "Run is already at maximum capacity." }, { status: 400 });
    }

    // Increment booked capacity
    targetRun.currentBooked += 1;

    // Generate random 4-digit Dual-OTPs
    const merchantReleaseOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const customerDeliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const trackingCode = `ADM-RUN-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      message: "Order joined pooled Bajaj run successfully",
      booking: {
        trackingCode,
        runId: targetRun.id,
        route: `${targetRun.originMarket} -> ${targetRun.destinationKebele}`,
        departureTime: targetRun.departureTime,
        driver: {
          name: targetRun.driverName,
          plate: targetRun.driverPlate,
          phone: targetRun.driverPhone,
          rating: targetRun.driverRating,
        },
        farePerDrop: targetRun.farePerDrop,
        merchantReleaseOtp,
        customerDeliveryOtp,
        itemTitle: itemTitle || "General Package",
        destination: `${dropoffKebele || targetRun.destinationKebele}, ${dropoffAddress || "Adama"}`,
        customerPhone: customerPhone || "+251911000000",
        status: "CONFIRMED_DISPATCH",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
