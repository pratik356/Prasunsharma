import { NextResponse } from "next/server"
import { getContactInfo } from "@/lib/database"

export async function GET() {
  try {
    const contactInfo = await getContactInfo()
    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 })
  }
}
