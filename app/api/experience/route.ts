import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("experience").select("*").order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching experience:", error)
      return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching experience:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
