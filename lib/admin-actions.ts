"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

// Project Actions
export async function createProject(formData: FormData) {
  const supabase = createClient()

  const projectData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string,
    technologies:
      formData
        .get("technologies")
        ?.toString()
        .split(",")
        .map((t) => t.trim()) || [],
    image_url: formData.get("image_url") as string,
    github_url: formData.get("github_url") as string,
    live_url: formData.get("live_url") as string,
    category: formData.get("category") as string,
    is_visible: formData.get("is_visible") === "on",
    is_featured: formData.get("is_featured") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabase.from("projects").insert([projectData])

  if (error) {
    console.error("Error creating project:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/projects")
  redirect("/admin/projects")
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = createClient()

  const projectData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    long_description: formData.get("long_description") as string,
    technologies:
      formData
        .get("technologies")
        ?.toString()
        .split(",")
        .map((t) => t.trim()) || [],
    image_url: formData.get("image_url") as string,
    github_url: formData.get("github_url") as string,
    live_url: formData.get("live_url") as string,
    category: formData.get("category") as string,
    is_visible: formData.get("is_visible") === "on",
    is_featured: formData.get("is_featured") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("projects").update(projectData).eq("id", id)

  if (error) {
    console.error("Error updating project:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
}

export async function deleteProject(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
}

export async function toggleProjectVisibility(id: string, isVisible: boolean) {
  const supabase = createClient()

  const { error } = await supabase
    .from("projects")
    .update({ is_visible: !isVisible, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error toggling project visibility:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
}

export async function toggleProjectFeatured(id: string, isFeatured: boolean) {
  const supabase = createClient()

  const { error } = await supabase
    .from("projects")
    .update({ is_featured: !isFeatured, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error toggling project featured status:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/projects")
  revalidatePath("/")
}

// Skill Actions
export async function createSkill(formData: FormData) {
  const supabase = createClient()

  const skillData = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: Number.parseInt(formData.get("proficiency") as string) || 0,
    icon: formData.get("icon") as string,
    is_visible: formData.get("is_visible") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabase.from("skills").insert([skillData])

  if (error) {
    console.error("Error creating skill:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = createClient()

  const skillData = {
    name: formData.get("name") as string,
    category: formData.get("category") as string,
    proficiency: Number.parseInt(formData.get("proficiency") as string) || 0,
    icon: formData.get("icon") as string,
    is_visible: formData.get("is_visible") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("skills").update(skillData).eq("id", id)

  if (error) {
    console.error("Error updating skill:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
}

export async function deleteSkill(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("skills").delete().eq("id", id)

  if (error) {
    console.error("Error deleting skill:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
}

export async function toggleSkillVisibility(id: string, isVisible: boolean) {
  const supabase = createClient()

  const { error } = await supabase
    .from("skills")
    .update({ is_visible: !isVisible, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error toggling skill visibility:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/skills")
  revalidatePath("/")
}

// Contact Info Actions
export async function createContactInfo(formData: FormData) {
  const supabase = createClient()

  const contactData = {
    field_name: formData.get("field_name") as string,
    display_label: formData.get("display_label") as string,
    field_value: formData.get("field_value") as string,
    icon: formData.get("icon") as string,
    is_visible: formData.get("is_visible") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabase.from("contact_info").insert([contactData])

  if (error) {
    console.error("Error creating contact info:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/contact")
  revalidatePath("/")
}

export async function updateContactInfo(id: string, formData: FormData) {
  const supabase = createClient()

  const contactData = {
    field_name: formData.get("field_name") as string,
    display_label: formData.get("display_label") as string,
    field_value: formData.get("field_value") as string,
    icon: formData.get("icon") as string,
    is_visible: formData.get("is_visible") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("contact_info").update(contactData).eq("id", id)

  if (error) {
    console.error("Error updating contact info:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/contact")
  revalidatePath("/")
}

export async function deleteContactInfo(id: string) {
  const supabase = createClient()

  const { error } = await supabase.from("contact_info").delete().eq("id", id)

  if (error) {
    console.error("Error deleting contact info:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/contact")
  revalidatePath("/")
}

// Portfolio Section Actions
export async function updatePortfolioSection(id: string, formData: FormData) {
  const supabase = createClient()

  const sectionData = {
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    content: formData.get("content") as string,
    is_visible: formData.get("is_visible") === "on",
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("portfolio_sections").update(sectionData).eq("id", id)

  if (error) {
    console.error("Error updating portfolio section:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/sections")
  revalidatePath("/")
}

// Experience Actions
export async function createExperience(formData: FormData) {
  const supabase = createClient()

  const experienceData = {
    company_name: formData.get("company_name") as string,
    position: formData.get("position") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    is_current: formData.get("is_current") === "on",
    start_month: Number.parseInt(formData.get("start_month") as string),
    start_year: Number.parseInt(formData.get("start_year") as string),
    end_month: formData.get("end_month") ? Number.parseInt(formData.get("end_month") as string) : null,
    end_year: formData.get("end_year") ? Number.parseInt(formData.get("end_year") as string) : null,
    is_visible: formData.get("is_visible") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
  }

  const { error } = await supabase.from("experience").insert([experienceData])

  if (error) {
    console.error("Error creating experience:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = createClient()

  const experienceData = {
    company_name: formData.get("company_name") as string,
    position: formData.get("position") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    is_current: formData.get("is_current") === "on",
    start_month: Number.parseInt(formData.get("start_month") as string),
    start_year: Number.parseInt(formData.get("start_year") as string),
    end_month: formData.get("end_month") ? Number.parseInt(formData.get("end_month") as string) : null,
    end_year: formData.get("end_year") ? Number.parseInt(formData.get("end_year") as string) : null,
    is_visible: formData.get("is_visible") === "on",
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from("experience").update(experienceData).eq("id", id)

  if (error) {
    console.error("Error updating experience:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
}

export async function deleteExperience(formData: FormData) {
  const supabase = createClient()

  const id = formData.get("id") as string
  const confirmText = formData.get("confirmText") as string

  if (confirmText !== "DELETE") {
    return { error: "Please type DELETE to confirm deletion" }
  }

  const { error } = await supabase.from("experience").delete().eq("id", id)

  if (error) {
    console.error("Error deleting experience:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
}

export async function toggleExperienceVisibility(formData: FormData) {
  const supabase = createClient()

  const id = formData.get("id") as string
  const isVisible = formData.get("is_visible") === "true"

  const { error } = await supabase
    .from("experience")
    .update({ is_visible: !isVisible, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error toggling experience visibility:", error)
    return { error: error.message }
  }

  revalidatePath("/admin/experience")
  revalidatePath("/")
}

// Settings Actions
export async function changePassword(formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  // Validate hardcoded credentials
  if (currentPassword !== "Pratik.....1") {
    return { error: "Current password is incorrect" }
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" }
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters long" }
  }

  // In a real app, you would update the password in the database
  // For now, we'll just return success since we're using hardcoded credentials
  return { success: "Password change functionality is not available with hardcoded credentials" }
}

export async function exportPortfolioData() {
  const supabase = createClient()

  try {
    // Fetch all portfolio data
    const [projects, skills, experience, contactInfo, portfolioSections] = await Promise.all([
      supabase.from("projects").select("*").order("display_order"),
      supabase.from("skills").select("*").order("display_order"),
      supabase.from("experience").select("*").order("display_order"),
      supabase.from("contact_info").select("*").order("display_order"),
      supabase.from("portfolio_sections").select("*"),
    ])

    const exportData = {
      exportDate: new Date().toISOString(),
      projects: projects.data || [],
      skills: skills.data || [],
      experience: experience.data || [],
      contactInfo: contactInfo.data || [],
      portfolioSections: portfolioSections.data || [],
    }

    return { success: true, data: exportData }
  } catch (error) {
    console.error("Error exporting portfolio data:", error)
    return { error: "Failed to export portfolio data" }
  }
}

export async function backupSettings() {
  const supabase = createClient()

  try {
    // Get current settings/configuration
    const { data: portfolioSections } = await supabase.from("portfolio_sections").select("*")

    const backupData = {
      backupDate: new Date().toISOString(),
      settings: {
        portfolioSections: portfolioSections || [],
      },
    }

    return { success: true, data: backupData }
  } catch (error) {
    console.error("Error backing up settings:", error)
    return { error: "Failed to backup settings" }
  }
}

// Fix cookies() usage in logoutAdmin
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  cookieStore.delete("otp_verified")

  redirect("/auth/login")
}

// Resume Actions
export async function uploadResumeAction(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("sb-auth-token")

  if (!token?.value) {
    return { error: "Unauthorized" }
  }

  try {
    const file = formData.get("file") as File
    if (!file) {
      return { error: "No file provided" }
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Resume upload error:", error)
    return { error: "Failed to upload resume" }
  }
}

export async function deleteResumeAction() {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from("portfolio_sections")
      .update({
        content: null,
        updated_at: new Date().toISOString(),
      })
      .eq("section_name", "resume")

    if (error) {
      console.error("Error deleting resume:", error)
      return { error: error.message }
    }

    revalidatePath("/admin/resume")
    revalidatePath("/")
    return { success: "Resume deleted successfully" }
  } catch (error) {
    console.error("Error deleting resume:", error)
    return { error: "Failed to delete resume" }
  }
}
