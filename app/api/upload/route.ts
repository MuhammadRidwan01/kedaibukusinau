import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configure sharp based on type
    let processed: Buffer;
    let ext = "webp";
    const timestamp = Date.now();
    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase();

    switch (type) {
      case "book":
        processed = await sharp(buffer).resize(800, null, { withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
        break;
      case "banner":
        processed = await sharp(buffer).resize(1920, null, { withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
        break;
      case "article":
        processed = await sharp(buffer).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
        break;
      case "logo":
        processed = await sharp(buffer).resize(400, null, { withoutEnlargement: true }).png({ quality: 90 }).toBuffer();
        ext = "png";
        break;
      default:
        processed = await sharp(buffer).resize(1200, null, { withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", type);
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${timestamp}-${baseName}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, processed);

    const url = `/uploads/${type}/${fileName}`;
    return NextResponse.json({ url, fileName });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
