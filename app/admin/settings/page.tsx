import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Database } from "lucide-react"
import { cookies } from "next/headers"
import ChangePasswordForm from "@/components/change-password-form"
import ExportDataButton from "@/components/export-data-button"
import BackupSettingsButton from "@/components/backup-settings-button"
import LogoutButton from "@/components/logout-button"

export default async function AdminSettings() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")
  const otpVerified = cookieStore.get("otp_verified")

  if (!adminSession || !otpVerified) {
    redirect("/auth/login")
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and application settings.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Admin Session</p>
                <p className="font-medium">Active</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">Just now</p>
              </div>
              <ChangePasswordForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Manage your portfolio data and content.</p>
              <div className="space-y-2">
                <ExportDataButton />
                <BackupSettingsButton />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="h-5 w-5" />
              Session Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              End your current admin session and return to the portfolio.
            </p>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
