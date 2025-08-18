import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Eye, EyeOff, Building, Calendar, MapPin } from "lucide-react"
import ExperienceForm from "@/components/experience-form"
import { toggleExperienceVisibility, deleteExperience } from "@/lib/admin-actions"
import { cookies } from "next/headers"

async function getExperience() {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("start_year", { ascending: false })
      .order("start_month", { ascending: false })

    if (error) {
      console.error("Error fetching experience:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching experience:", error)
    return []
  }
}

function formatDateRange(
  startMonth: number,
  startYear: number,
  endMonth?: number,
  endYear?: number,
  isCurrent?: boolean,
) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const startDate = `${months[startMonth - 1]} ${startYear}`

  if (isCurrent) {
    return `${startDate} - Present`
  }

  if (endMonth && endYear) {
    const endDate = `${months[endMonth - 1]} ${endYear}`
    return `${startDate} - ${endDate}`
  }

  return startDate
}

function DeleteExperienceDialog({ experience }: { experience: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive bg-transparent">
          <Trash2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Experience</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this experience? This action cannot be undone.
          </p>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium">{experience.position}</p>
            <p className="text-sm text-muted-foreground">{experience.company_name}</p>
          </div>
          <form action={deleteExperience} className="space-y-4">
            <input type="hidden" name="id" value={experience.id} />
            <div className="space-y-2">
              <Label htmlFor="confirmText">Type "DELETE" to confirm:</Label>
              <Input id="confirmText" name="confirmText" placeholder="DELETE" required />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                Delete Experience
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default async function AdminExperience() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")
  const otpVerified = cookieStore.get("otp_verified")

  if (!adminSession || !otpVerified) {
    redirect("/auth/login")
  }

  const experiences = await getExperience()

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Experience Management</h1>
            <p className="text-muted-foreground mt-2">Manage your work experience and professional background.</p>
          </div>
          <ExperienceForm />
        </div>

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No experience added yet</h3>
                  <p className="text-muted-foreground">
                    Add your work experience to showcase your professional journey.
                  </p>
                </div>
                <ExperienceForm />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {experiences.map((experience) => (
              <Card key={experience.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{experience.position}</CardTitle>
                      <div className="flex items-center gap-2 text-primary font-medium mt-1">
                        <Building className="h-4 w-4" />
                        {experience.company_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {experience.is_current && <Badge variant="default">Current</Badge>}
                      <Badge variant={experience.is_visible ? "default" : "secondary"}>
                        {experience.is_visible ? (
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDateRange(
                        experience.start_month,
                        experience.start_year,
                        experience.end_month,
                        experience.end_year,
                        experience.is_current,
                      )}
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {experience.location}
                      </div>
                    )}
                  </div>
                  {experience.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm mt-1 line-clamp-3">{experience.description}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <ExperienceForm experience={experience} />
                    <form action={toggleExperienceVisibility}>
                      <input type="hidden" name="id" value={experience.id} />
                      <input type="hidden" name="is_visible" value={experience.is_visible.toString()} />
                      <Button size="sm" variant="outline" type="submit">
                        {experience.is_visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </form>
                    <DeleteExperienceDialog experience={experience} />
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
