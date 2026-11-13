import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, email, role, name, kebele } = body;

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, error: "Please provide either an email or mobile number." },
        { status: 400 }
      );
    }

    let user = null;

    if (email && email.trim()) {
      const cleanEmail = email.toLowerCase().trim();
      user = await prisma.user.findFirst({
        where: { email: cleanEmail },
      });
    } else if (phone && phone.trim()) {
      const cleanPhone = phone.replace(/\s+/g, "");
      user = await prisma.user.findFirst({
        where: { phone: cleanPhone },
      });
    }

    if (!user) {
      const cleanEmail = email ? email.toLowerCase().trim() : null;
      const cleanPhone = phone
        ? phone.replace(/\s+/g, "")
        : `+2519${Math.floor(10000000 + Math.random() * 90000000)}`;

      user = await prisma.user.create({
        data: {
          name: name || (cleanEmail ? cleanEmail.split("@")[0] : `Customer ${cleanPhone.slice(-4)}`),
          email: cleanEmail,
          phone: cleanPhone,
          passwordHash: "secure_hash",
          role: role || "BUYER",
          city: "Addis Ababa",
          kebele: kebele || "Bole",
          landmark: "Central",
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
        email: user.email,
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
