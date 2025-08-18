import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

    const { data, error } = await supabase
      .from("experience")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating experience:", error)
      return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error updating experience:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check admin authentication
    const cookieStore = cookies()
    const adminSession = cookieStore.get("admin_session")
    const otpVerified = cookieStore.get("otp_verified")

    if (!adminSession || !otpVerified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    const { error } = await supabase.from("experience").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting experience:", error)
      return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting experience:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
