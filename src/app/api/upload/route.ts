import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(7);
            const extension = file.name.split(".").pop();
            const filename = `${timestamp}-${randomString}.${extension}`;

            // Save to public/uploads
            const uploadDir = join(process.cwd(), "public", "uploads");
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);

            // Return public URL
            uploadedUrls.push(`/uploads/${filename}`);
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
