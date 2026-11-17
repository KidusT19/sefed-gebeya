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

let STORED_OFFERS: StoredOffer[] = [];

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
