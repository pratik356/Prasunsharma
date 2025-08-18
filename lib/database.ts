import { createClient } from "@/lib/supabase/server"

export interface PortfolioSection {
  id: string
  section_name: string
  title: string
  subtitle: string
  content: string
  is_visible: boolean
  display_order: number
}

export interface Project {
  id: string
  title: string
  description: string
  long_description: string
  technologies: string[]
  image_url: string
  github_url: string
  live_url: string
  category: string
  is_visible: boolean
  is_featured: boolean
  display_order: number
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string
  is_visible: boolean
  display_order: number
}

export interface ContactInfo {
  id: string
  field_name: string
  display_label: string
  field_value: string
  icon: string
  is_visible: boolean
  display_order: number
}

export interface Certification {
  id: string
  title: string
  issuer: string
  credential_id: string
  credential_url: string
  badge_url: string
  issue_date: string
  expiry_date: string
  is_visible: boolean
  display_order: number
}

export async function getPortfolioSections() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("portfolio_sections")
    .select("*")
    .eq("is_visible", true)
    .order("display_order")

  if (error) {
    console.error("Error fetching portfolio sections:", error)
    return []
  }

  return data as PortfolioSection[]
}

export async function getFeaturedProjects() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_visible", true)
    .eq("is_featured", true)
    .order("display_order")
    .limit(6)

  if (error) {
    console.error("Error fetching featured projects:", error)
    return []
  }

  return data as Project[]
}

export async function getSkillsByCategory() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_visible", true)
    .order("category, display_order")

  if (error) {
    console.error("Error fetching skills:", error)
    return []
  }

  return data as Skill[]
}

export async function getContactInfo() {
  const supabase = createClient()
  const { data, error } = await supabase.from("contact_info").select("*").eq("is_visible", true).order("display_order")

  if (error) {
    console.error("Error fetching contact info:", error)
    return []
  }

  return data as ContactInfo[]
}

export async function getCertifications() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("is_visible", true)
    .order("display_order")

  if (error) {
    console.error("Error fetching certifications:", error)
    return []
  }

  return data as Certification[]
}
