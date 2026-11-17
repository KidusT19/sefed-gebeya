import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_LISTINGS } from "@/data/mockData";
import { ProductListing } from "@/types/marketplace";

const VALID_CONDITIONS = ["Brand New", "Like New", "Excellent", "Good", "Fair"] as const;
type ConditionType = (typeof VALID_CONDITIONS)[number];

function normalizeCondition(cond?: string | null): ConditionType {
  if (cond && VALID_CONDITIONS.includes(cond as ConditionType)) {
    return cond as ConditionType;
  }
  return "Like New";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.toLowerCase();
    const category = searchParams.get("category");
    const kebele = searchParams.get("kebele");
    const condition = searchParams.get("condition");
    const allowBarter = searchParams.get("barter") === "true";
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const sort = searchParams.get("sort") || "newest";

    // Attempt to query SQLite Prisma database
    let allItems: ProductListing[] = [];
    try {
      const dbListings = await prisma.listing.findMany({
        include: {
          user: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
      });

      if (dbListings && dbListings.length > 0) {
        allItems = dbListings.map((item) => {
          let parsedImages: string[] = [];
          try {
            parsedImages = JSON.parse(item.imageUrls);
          } catch {
            parsedImages = [item.imageUrls];
          }

          return {
            id: item.id,
            title: item.title,
            price: item.price,
            isNegotiable: true,
            condition: normalizeCondition(item.condition),
            categorySlug: item.category?.slug || "phones",
            subcategory: item.category?.name || "General",
            description: item.description,
            images: parsedImages.length > 0 ? parsedImages : [
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
            ],
            city: item.city,
            kebele: item.kebele,
            landmark: item.landmark || "Adama Center",
            allowBarter: item.allowBarter,
            wishlist: item.targetWishlist || "",
            allowCash: item.allowCashBuy,
            seller: {
              id: item.user.id,
              name: item.user.name,
              phone: item.user.phone,
              whatsapp: item.user.phone,
              city: item.user.city,
              kebele: item.user.kebele || item.kebele,
              isVerified: true,
              memberSince: "Nov 2026",
              rating: item.user.rating || 5.0,
              completedDeals: item.user.completedTrades || 1,
              avatar: item.user.avatarUrl || "",
            },
            postedDate: "Active Now",
            views: 45,
            isFeatured: false,
          };
        });
      }
    } catch (dbErr) {
      console.warn("Prisma listings query fallback to mockData:", dbErr);
    }

    // Fallback or merge with mock listings if database is empty
    if (allItems.length === 0) {
      allItems = [...MOCK_LISTINGS];
    }

    // Apply Filters
    let results = allItems.filter((item) => {
      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchWish = item.wishlist.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchWish) return false;
      }
      if (category && item.categorySlug !== category) return false;
      if (kebele && kebele !== "All" && item.kebele !== kebele) return false;
      if (condition && condition !== "All" && item.condition !== condition) return false;
      if (allowBarter && !item.allowBarter) return false;
      if (minPrice !== null && item.price < minPrice) return false;
      if (maxPrice !== null && item.price > maxPrice) return false;
      return true;
    });

    if (sort === "price-low") results.sort((a, b) => a.price - b.price);
    if (sort === "price-high") results.sort((a, b) => b.price - a.price);

    return NextResponse.json({
      success: true,
      total: results.length,
      source: allItems.length > 0 ? "database" : "seed",
      listings: results,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.price || !body.kebele) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, price, and kebele are required." },
        { status: 400 }
      );
    }

    // Lookup or find seller user
    let user = await prisma.user.findFirst({
      where: { phone: body.sellerPhone || "+251911448822" },
    });

    if (!user) {
      // Find first user or create a merchant user
      user = await prisma.user.findFirst({
        where: { role: "MERCHANT" },
      });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: body.sellerName || "Adama Merchant",
            phone: body.sellerPhone || `+2519${Math.floor(10000000 + Math.random() * 90000000)}`,
            passwordHash: "hash_placeholder",
            role: "MERCHANT",
            city: "Adama",
            kebele: body.kebele,
            landmark: body.landmark || "Adama Center",
          },
        });
      }
    }

    // Find category
    let category = await prisma.category.findUnique({
      where: { slug: body.category || "phones" },
    });

    if (!category) {
      category = await prisma.category.findFirst();
    }

    const imagesToStore = body.images && body.images.length > 0 ? body.images : [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    ];

    // Create listing in Prisma SQLite
    const created = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description || "",
        price: Number(body.price),
        condition: body.condition || "Like New",
        allowBarter: body.allowBarter ?? true,
        allowCashBuy: true,
        targetWishlist: body.wishlist || "",
        city: body.city || "Adama",
        kebele: body.kebele,
        landmark: body.landmark || "Adama Center",
        imageUrls: JSON.stringify(imagesToStore),
        userId: user.id,
        categoryId: category ? category.id : "cat-default",
      },
      include: {
        user: true,
        category: true,
      },
    });

    const formattedListing: ProductListing = {
      id: created.id,
      title: created.title,
      price: created.price,
      isNegotiable: body.isNegotiable ?? true,
      condition: normalizeCondition(created.condition),
      categorySlug: created.category?.slug || body.category || "phones",
      subcategory: created.category?.name || "General",
      description: created.description,
      images: imagesToStore,
      city: created.city,
      kebele: created.kebele,
      landmark: created.landmark || "Adama Center",
      allowBarter: created.allowBarter,
      wishlist: created.targetWishlist || "",
      allowCash: true,
      seller: {
        id: created.user.id,
        name: created.user.name,
        phone: created.user.phone,
        whatsapp: created.user.phone,
        city: created.user.city,
        kebele: created.user.kebele || created.kebele,
        isVerified: true,
        memberSince: "Nov 2026",
        rating: created.user.rating || 5.0,
        completedDeals: created.user.completedTrades || 1,
        avatar: created.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
      },
      postedDate: "Just now",
      views: 1,
      isFeatured: false,
    };

    return NextResponse.json({
      success: true,
      message: "Listing published successfully to Prisma database",
      listing: formattedListing,
    });
  } catch (err: any) {
    console.error("Error creating listing:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
