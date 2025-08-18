import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()

    // Get profile settings from portfolio_sections table
    const { data, error } = await supabase.from("portfolio_sections").select("*").eq("section_name", "profile").single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error)
      return NextResponse.json({ profile_image_url: null })
    }

    return NextResponse.json({
      profile_image_url: data?.content || null,
    })
  } catch (error) {
    console.error("Error in profile API:", error)
    return NextResponse.json({ profile_image_url: null })
  }
}

export async function POST(request: Request) {
  try {
    const { profile_image_url } = await request.json()
    const supabase = createClient()

    // Upsert profile image URL
    const { error } = await supabase.from("portfolio_sections").upsert({
      section_name: "profile",
      title: "Profile Image",
      subtitle: "",
      content: profile_image_url,
      is_visible: true,
      display_order: 0,
    })

    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in profile API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
