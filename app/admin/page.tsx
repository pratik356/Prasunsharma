import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Briefcase, Award, Mail, FileText, TrendingUp } from "lucide-react"

async function getPortfolioStats() {
  const supabase = createClient()

  try {
    const [projectsResult, skillsResult, sectionsResult, contactResult] = await Promise.all([
      supabase.from("projects").select("id, is_visible, is_featured").eq("is_visible", true),
      supabase.from("skills").select("id, is_visible").eq("is_visible", true),
      supabase.from("portfolio_sections").select("id, is_visible").eq("is_visible", true),
      supabase.from("contact_info").select("id, is_visible").eq("is_visible", true),
    ])

    const projects = projectsResult.data || []
    const skills = skillsResult.data || []
    const sections = sectionsResult.data || []
    const contacts = contactResult.data || []

    return {
      totalProjects: projects.length,
      featuredProjects: projects.filter((p) => p.is_featured).length,
      totalSkills: skills.length,
      totalSections: sections.length,
      totalContacts: contacts.length,
    }
  } catch (error) {
    console.error("Error fetching portfolio stats:", error)
    return {
      totalProjects: 0,
      featuredProjects: 0,
      totalSkills: 0,
      totalSections: 0,
      totalContacts: 0,
    }
  }
}

export default async function AdminDashboard() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")?.value
  const otpVerified = cookieStore.get("otp_verified")?.value

  if (adminSession !== "authenticated" || otpVerified !== "true") {
    redirect("/auth/login")
  }

  const stats = await getPortfolioStats()

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      description: `${stats.featuredProjects} featured`,
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Skills",
      value: stats.totalSkills,
      description: "Active skills",
      icon: Award,
      color: "text-green-600",
    },
    {
      title: "Portfolio Sections",
      value: stats.totalSections,
      description: "Content sections",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Contact Methods",
      value: stats.totalContacts,
      description: "Contact options",
      icon: Mail,
      color: "text-orange-600",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your portfolio.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Content Management</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Add New Project</Badge>
                  <Badge variant="outline">Update Skills</Badge>
                  <Badge variant="outline">Edit About Section</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Portfolio Status</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Portfolio Live</Badge>
                  <Badge variant="secondary">All Sections Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Portfolio sections updated</span>
                  <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>New project added</span>
                  <span className="text-muted-foreground">2 days ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Skills updated</span>
                  <span className="text-muted-foreground">1 week ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Admin User:</span>
                <span className="text-muted-foreground">Pratik556</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <span className="text-muted-foreground">prasun.sharm@gmail.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Session Status:</span>
                <Badge variant="secondary">Authenticated</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">OTP Verified:</span>
                <Badge variant="secondary">Verified</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
