import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Clean filename
      const ext = path.extname(file.name) || ".jpg";
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", cleanName);

      await writeFile(uploadPath, buffer);
      uploadedUrls.push(`/uploads/${cleanName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "File upload failed: " + error.message },
      { status: 500 }
    );
  }
}
