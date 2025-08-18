import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")
    const otpVerified = cookieStore.get("otp_verified")

    if (!adminSession || !otpVerified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()
    const body = await request.json()

    const { data, error } = await supabase.from("experience").insert([body]).select().single()

    if (error) {
      console.error("Error creating experience:", error)
      return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating experience:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
