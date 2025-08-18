"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { uploadResumeAction, deleteResumeAction } from "@/lib/admin-actions"
import { useFormStatus } from "react-dom"

function SubmitButton({ hasFile }: { hasFile: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending || !hasFile} className="w-full">
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Uploading...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </>
      )}
    </Button>
  )
}

export default function ResumeUploadForm() {
  const [currentResume, setCurrentResume] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchCurrentResume()
  }, [])

  const fetchCurrentResume = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/resume")
      if (response.ok) {
        const data = await response.json()
        setCurrentResume(data.resume_url)
      }
    } catch (error) {
      console.error("Error fetching current resume:", error)
      setError("Failed to load current resume")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setSuccess(null)

    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file only")
        setSelectedFile(null)
        e.target.value = ""
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        setSelectedFile(null)
        e.target.value = ""
        return
      }

      setSelectedFile(file)
      setSuccess(`Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    } else {
      setSelectedFile(null)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete the current resume? This action cannot be undone.")) {
      try {
        await deleteResumeAction()
        setCurrentResume(null)
        setSuccess("Resume deleted successfully")
        fetchCurrentResume()
      } catch (error) {
        console.error("Error deleting resume:", error)
        setError("Failed to delete resume")
      }
    }
  }

  const handleFormAction = async (formData: FormData) => {
    try {
      setError(null)
      console.log("[v0] Form submission started")
      const result = await uploadResumeAction(formData)

      if (result.error) {
        console.log("[v0] Upload failed with error:", result.error)
        setError(result.error)
      } else {
        console.log("[v0] Upload successful, refreshing data")
        setSuccess("Resume uploaded successfully!")
        setSelectedFile(null)
        // Reset form
        const form = document.querySelector("form") as HTMLFormElement
        form?.reset()
        await fetchCurrentResume()
      }
    } catch (error) {
      console.error("[v0] Error in form submission:", error)
      setError("Failed to upload resume. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Current Resume */}
      {currentResume && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Current Resume</p>
                  <p className="text-sm text-muted-foreground">PDF file ready for download</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => window.open(currentResume, "_blank")}>
                  View PDF
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Form */}
      <Card>
        <CardContent className="pt-6">
          <form action={handleFormAction} className="space-y-4">
            <div>
              <Label htmlFor="resume">Upload New Resume</Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">PDF files only, maximum 10MB</p>
            </div>

            <SubmitButton hasFile={!!selectedFile} />
          </form>
        </CardContent>
      </Card>

      {showPreview && currentResume && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Resume Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                ×
              </Button>
            </div>
            <div className="flex-1 p-4">
              <iframe src={currentResume} className="w-full h-[70vh] border rounded" title="Resume Preview" />
            </div>
            <div className="p-4 border-t flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button onClick={() => window.open(currentResume, "_blank")}>Download PDF</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
