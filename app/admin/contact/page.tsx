import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { cookies } from "next/headers"
import ContactInfoForm from "@/components/contact-info-form"
import ContactDeleteButton from "@/components/contact-delete-button"
import ContactVisibilityToggle from "@/components/contact-visibility-toggle"

async function getContactInfo() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("contact_info").select("*").order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching contact info:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return []
  }
}

export default async function AdminContact() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")
  const otpVerified = cookieStore.get("otp_verified")

  if (!adminSession || !otpVerified) {
    redirect("/auth/login")
  }

  const contactInfo = await getContactInfo()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contact Information</h1>
            <p className="text-muted-foreground mt-2">Manage your contact details and social media links.</p>
          </div>
          <ContactInfoForm>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact Method
            </Button>
          </ContactInfoForm>
        </div>

        {/* Contact Info List */}
        {contactInfo.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No contact information yet</h3>
                  <p className="text-muted-foreground">Add your contact details to help visitors reach you.</p>
                </div>
                <ContactInfoForm>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact Information
                  </Button>
                </ContactInfoForm>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {contactInfo.map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contact.display_label}</CardTitle>
                    <Badge variant={contact.is_visible ? "default" : "secondary"}>
                      {contact.is_visible ? (
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Field Name</p>
                    <p className="font-medium">{contact.field_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Value</p>
                    <p className="font-medium">{contact.field_value}</p>
                  </div>
                  <div className="flex gap-2">
                    <ContactInfoForm contact={contact}>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </ContactInfoForm>
                    <ContactVisibilityToggle contact={contact}>
                      <Button size="sm" variant="outline">
                        {contact.is_visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </ContactVisibilityToggle>
                    <ContactDeleteButton contact={contact}>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </ContactDeleteButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
