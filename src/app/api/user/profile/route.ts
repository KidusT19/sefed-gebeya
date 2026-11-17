import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, email, city, kebele, landmark, avatarUrl, businessName } = body;

    if (!id && !phone && !email) {
      return NextResponse.json(
        { success: false, error: "User identifier required (id, phone, or email)." },
        { status: 400 }
      );
    }

    // Find existing user in database
    let existing = null;
    if (id && !id.startsWith("usr-") && !id.startsWith("sel-") && id !== "guest") {
      try {
        existing = await prisma.user.findUnique({ where: { id } });
      } catch {}
    }

    if (!existing && phone) {
      const cleanPhone = phone.replace(/\s+/g, "");
      existing = await prisma.user.findFirst({ where: { phone: cleanPhone } });
    }

    if (!existing && email) {
      const cleanEmail = email.toLowerCase().trim();
      existing = await prisma.user.findFirst({ where: { email: cleanEmail } });
    }

    if (existing) {
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: name ?? existing.name,
          phone: phone ? phone.replace(/\s+/g, "") : existing.phone,
          email: email ? email.toLowerCase().trim() : existing.email,
          city: city ?? existing.city,
          kebele: kebele ?? existing.kebele,
          landmark: landmark ?? existing.landmark,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : existing.avatarUrl,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully in database",
        user: {
          id: updated.id,
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          city: updated.city,
          kebele: updated.kebele,
          avatarUrl: updated.avatarUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated locally (unmatched DB record)",
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
