import { NextResponse } from "next/server";

export interface StoredReview {
  id: string;
  sellerId: string;
  author: string;
  kebele: string;
  rating: number;
  dealType: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  createdAt: number;
}

let STORED_REVIEWS: StoredReview[] = [
  {
    id: "rev-s1",
    sellerId: "sel-1",
    author: "Chaltu Girma",
    kebele: "Bole Kebele",
    rating: 5,
    dealType: "Cash + Pooled Bajaj",
    comment:
      "Met outside Posta Bet, verified device IMEI and battery health. Delivery driver arrived right on schedule for 40 ETB. 100% genuine seller in Adama!",
    date: "3 days ago",
    verifiedBuyer: true,
    createdAt: Date.now() - 259200000,
  },
  {
    id: "rev-s2",
    sellerId: "sel-1",
    author: "Dawit Bekele",
    kebele: "Arada Market",
    rating: 5,
    dealType: "Barter Swap (HP for Dell)",
    comment:
      "We did a direct barter with a 5,000 ETB cash top-up difference via Telebirr escrow. Smooth, honest, and zero disputes.",
    date: "1 week ago",
    verifiedBuyer: true,
    createdAt: Date.now() - 604800000,
  },
  {
    id: "rev-s3",
    sellerId: "sel-1",
    author: "Yonas Worku",
    kebele: "Kebele 04",
    rating: 4,
    dealType: "3-Way Circular Trade",
    comment:
      "Participated in a 3-way circular trade loop across Adama. The item matched the photos and description accurately.",
    date: "2 weeks ago",
    verifiedBuyer: true,
    createdAt: Date.now() - 1209600000,
  },
  {
    id: "rev-s4",
    sellerId: "sel-1",
    author: "Almaz Kebede",
    kebele: "Posta Bet",
    rating: 5,
    dealType: "In-Person Inspection",
    comment:
      "Very patient seller. Allowed full 15 minutes inspection of laptop ports and screen before confirming OTP release.",
    date: "1 month ago",
    verifiedBuyer: true,
    createdAt: Date.now() - 2592000000,
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sellerId = searchParams.get("sellerId");

  const filtered = sellerId ? STORED_REVIEWS.filter((r) => r.sellerId === sellerId) : STORED_REVIEWS;

  const averageRating =
    filtered.length > 0
      ? Number((filtered.reduce((acc, curr) => acc + curr.rating, 0) / filtered.length).toFixed(1))
      : 5.0;

  return NextResponse.json({
    success: true,
    total: filtered.length,
    averageRating,
    reviews: filtered,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sellerId = "sel-1", author = "Verified Buyer", kebele = "Bole", rating = 5, comment } = body;

    if (!comment?.trim()) {
      return NextResponse.json(
        { success: false, error: "Review comment is required" },
        { status: 400 }
      );
    }

    const newReview: StoredReview = {
      id: `rev-${Date.now()}`,
      sellerId,
      author,
      kebele,
      rating: Number(rating) || 5,
      dealType: "Verified Deal",
      comment: comment.trim(),
      date: "Just now",
      verifiedBuyer: true,
      createdAt: Date.now(),
    };

    STORED_REVIEWS.unshift(newReview);

    const sellerReviews = STORED_REVIEWS.filter((r) => r.sellerId === sellerId);
    const averageRating = Number(
      (sellerReviews.reduce((acc, curr) => acc + curr.rating, 0) / sellerReviews.length).toFixed(1)
    );

    return NextResponse.json({
      success: true,
      review: newReview,
      total: sellerReviews.length,
      averageRating,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
      { status: 500 }
    );
  }
}
