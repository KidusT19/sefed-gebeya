import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, role, name, kebele } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    // Try finding existing user
    let user = await prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      // Auto-register new user
      user = await prisma.user.create({
        data: {
          name: name || `User ${phone.slice(-4)}`,
          phone,
          passwordHash: "demo_hash",
          role: role || "BUYER",
          city: "Adama",
          kebele: kebele || "Bole",
          landmark: "Adama Center",
          rating: 5.0,
          completedTrades: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Signed in successfully as ${user.name}`,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        city: user.city,
        kebele: user.kebele,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        completedTrades: user.completedTrades,
      },
    });
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
