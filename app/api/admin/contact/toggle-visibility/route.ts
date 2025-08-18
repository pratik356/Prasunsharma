import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = formData.get("id") as string
    const isVisible = formData.get("is_visible") === "true"

    const supabase = createClient()

    const { error } = await supabase
      .from("contact_info")
      .update({ is_visible: !isVisible, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error toggling contact visibility:", error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    revalidatePath("/admin/contact")
    revalidatePath("/")

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error toggling contact visibility:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
