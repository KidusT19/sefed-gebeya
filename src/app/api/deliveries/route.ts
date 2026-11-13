import { NextResponse } from "next/server";
import { ActiveDelivery } from "@/context/MarketplaceContext";

let STORED_DELIVERIES: ActiveDelivery[] = [
  {
    id: "del-101",
    trackingCode: "ADM-RUN-101-449",
    listingTitle: "iPhone 13 Pro 128GB (Sierra Blue)",
    itemPrice: 55000,
    deliveryFee: 40,
    originMarket: "Arada Market, Stall 14",
    destinationKebele: "Bole Kebele, Gate 2",
    driverName: "Abebe Demissie",
    driverPlate: "3-B042-OR (Bajaj RE)",
    driverPhone: "+251911448822",
    merchantReleaseOtp: "4829",
    customerDeliveryOtp: "9153",
    status: "IN_TRANSIT",
    departureTime: "In 15 mins",
  },
  {
    id: "del-102",
    trackingCode: "ADM-RUN-102-881",
    listingTitle: "Dell XPS 13 Ultrabook (Core i7)",
    itemPrice: 68000,
    deliveryFee: 40,
    originMarket: "Arada Central Hub",
    destinationKebele: "Kebele 04, Behind Stadium",
    driverName: "Abebe Demissie",
    driverPlate: "3-B042-OR (Bajaj RE)",
    driverPhone: "+251911448822",
    merchantReleaseOtp: "5318",
    customerDeliveryOtp: "7741",
    status: "DISPATCHED",
    departureTime: "In 35 mins",
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const delivery = STORED_DELIVERIES.find((d) => d.trackingCode === code);
    if (!delivery) {
      return NextResponse.json({ success: false, error: "Delivery not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, delivery });
  }

  return NextResponse.json({
    success: true,
    total: STORED_DELIVERIES.length,
    deliveries: STORED_DELIVERIES,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      listingTitle,
      itemPrice = 0,
      deliveryFee = 40,
      originMarket = "Arada Market",
      destinationKebele = "Bole",
      driverName = "Abebe Demissie",
      driverPlate = "3-B042-OR",
      driverPhone = "+251911448822",
      departureTime = "In 25 mins",
    } = body;

    const genOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
    const trackingCode = `ADM-RUN-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;

    const newDelivery: ActiveDelivery = {
      id: `del-${Date.now()}`,
      trackingCode,
      listingTitle: listingTitle || "Adama Delivery Parcel",
      itemPrice: Number(itemPrice),
      deliveryFee: Number(deliveryFee),
      originMarket,
      destinationKebele,
      driverName,
      driverPlate,
      driverPhone,
      merchantReleaseOtp: genOtp(),
      customerDeliveryOtp: genOtp(),
      status: "DISPATCHED",
      departureTime,
    };

    STORED_DELIVERIES.unshift(newDelivery);

    return NextResponse.json({
      success: true,
      delivery: newDelivery,
      total: STORED_DELIVERIES.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create delivery" },
      { status: 500 }
    );
  }
}
