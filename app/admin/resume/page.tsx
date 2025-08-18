"use client"
import AdminLayout from "@/components/admin-layout"
import ResumeUploadForm from "@/components/resume-upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResumeAdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Resume Management</h1>
            <p className="text-muted-foreground mt-2">Upload and manage your resume file for portfolio download.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
            <CardDescription>
              Upload your resume in PDF format. This will be available for preview and download on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeUploadForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
