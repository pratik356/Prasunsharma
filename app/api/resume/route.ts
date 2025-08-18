import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] Fetching resume from database...")
    const supabase = createClient()

    const { data, error } = await supabase
      .from("portfolio_sections")
      .select("content")
      .eq("section_name", "resume")
      .single()

    console.log("[v0] Resume query result:", { data, error })

    if (error && error.code !== "PGRST116") {
      console.error("[v0] Database error:", error)
      throw error
    }

    const resumeUrl = data?.content || null
    console.log("[v0] Returning resume URL:", resumeUrl)

    return NextResponse.json({
      resume_url: resumeUrl,
    })
  } catch (error) {
    console.error("[v0] Error fetching resume:", error)
    return NextResponse.json({ resume_url: null })
  }
}
