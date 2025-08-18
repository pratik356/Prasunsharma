import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, EyeOff } from "lucide-react"
import { cookies } from "next/headers"
import PortfolioSectionForm from "@/components/portfolio-section-form"

async function getPortfolioSections() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("portfolio_sections")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching portfolio sections:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching portfolio sections:", error)
    return []
  }
}

export default async function AdminSections() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")
  const otpVerified = cookieStore.get("otp_verified")

  if (!adminSession || !otpVerified) {
    redirect("/auth/login")
  }

  const sections = await getPortfolioSections()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Portfolio Sections</h1>
          <p className="text-muted-foreground mt-2">Manage the content sections of your portfolio.</p>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{section.section_name}</CardTitle>
                    {section.title && <p className="text-muted-foreground mt-1">{section.title}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={section.is_visible ? "default" : "secondary"}>
                      {section.is_visible ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </>
                      )}
                    </Badge>
                    <PortfolioSectionForm section={section}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </PortfolioSectionForm>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {section.subtitle && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Subtitle</p>
                    <p className="font-medium">{section.subtitle}</p>
                  </div>
                )}
                {section.content && (
                  <div>
                    <p className="text-sm text-muted-foreground">Content</p>
                    <p className="text-sm mt-1 line-clamp-3">{section.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
