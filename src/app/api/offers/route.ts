import { NextResponse } from "next/server";

export interface StoredOffer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  offeredPrice: number;
  sellerName: string;
  sellerPhone: string;
  message: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "IN_ESCROW";
  date: string;
  createdAt: number;
}

let STORED_OFFERS: StoredOffer[] = [
  {
    id: "off-1",
    listingId: "lst-2",
    listingTitle: "Dell XPS 13 (Core i7 11th Gen, 16GB RAM)",
    listingPrice: 68000,
    offeredPrice: 63000,
    sellerName: "Arada Tech Store (Dawit B.)",
    sellerPhone: "+251922771133",
    message: "I can pay 63,000 ETB cash today via Telebirr. Can we meet at Arada?",
    status: "PENDING",
    date: "Today, 11:20 AM",
    createdAt: Date.now() - 7200000,
  },
  {
    id: "off-2",
    listingId: "lst-1",
    listingTitle: "iPhone 13 Pro 128GB - Sierra Blue",
    listingPrice: 55000,
    offeredPrice: 52000,
    sellerName: "Henok Tadesse",
    sellerPhone: "+251911448822",
    message: "I am ready to buy via Telebirr today if you accept 52,000 ETB.",
    status: "ACCEPTED",
    date: "Yesterday",
    createdAt: Date.now() - 86400000,
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get("listingId");

  const filtered = listingId ? STORED_OFFERS.filter((o) => o.listingId === listingId) : STORED_OFFERS;

  return NextResponse.json({
    success: true,
    total: filtered.length,
    offers: filtered,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listingId, listingTitle, listingPrice, offeredPrice, sellerName, sellerPhone, message } = body;

    if (!listingId || !offeredPrice) {
      return NextResponse.json(
        { success: false, error: "listingId and offeredPrice are required" },
        { status: 400 }
      );
    }

    const newOffer: StoredOffer = {
      id: `off-${Date.now()}`,
      listingId,
      listingTitle: listingTitle || "Adama Listing",
      listingPrice: Number(listingPrice) || 0,
      offeredPrice: Number(offeredPrice),
      sellerName: sellerName || "Seller in Adama",
      sellerPhone: sellerPhone || "+251911000000",
      message: message || "Cash offer submitted via Sebez Market",
      status: "PENDING",
      date: "Just now",
      createdAt: Date.now(),
    };

    STORED_OFFERS.unshift(newOffer);

    return NextResponse.json({
      success: true,
      offer: newOffer,
      total: STORED_OFFERS.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { offerId, status } = body;

    if (!offerId || !status) {
      return NextResponse.json(
        { success: false, error: "offerId and status are required" },
        { status: 400 }
      );
    }

    const offer = STORED_OFFERS.find((o) => o.id === offerId);
    if (!offer) {
      return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 });
    }

    offer.status = status;

    return NextResponse.json({
      success: true,
      offer,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
