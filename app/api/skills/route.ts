import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("category, display_order", { ascending: true })

    if (error) {
      console.error("Error fetching skills:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
