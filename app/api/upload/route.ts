import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API: Starting file upload process")

    const formData = await request.formData()
    console.log("[v0] Upload API: FormData received")

    const file = formData.get("file") as File
    console.log("[v0] Upload API: File extracted:", file?.name, file?.type, file?.size)

    if (!file) {
      console.log("[v0] Upload API: No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Upload API: Uploading to Vercel Blob...")

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    console.log("[v0] Upload API: Upload successful, blob URL:", blob.url)
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload API: Error uploading file:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
