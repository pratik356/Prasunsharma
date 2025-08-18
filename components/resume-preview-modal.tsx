"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, FileText, X } from "lucide-react"

interface ResumePreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumePreviewModal({ isOpen, onClose }: ResumePreviewModalProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchResume()
    }
  }, [isOpen])

  const fetchResume = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/resume")
      if (response.ok) {
        const data = await response.json()
        setResumeUrl(data.resume_url)
      }
    } catch (error) {
      console.error("Error fetching resume:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (resumeUrl) {
      const link = document.createElement("a")
      link.href = resumeUrl
      link.download = "Prasun_Sharma_Resume.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Resume Preview
            </span>
            <div className="flex items-center space-x-2">
              {resumeUrl && (
                <Button onClick={handleDownload} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Loading resume...</p>
              </div>
            </div>
          ) : resumeUrl ? (
            <iframe src={resumeUrl} className="w-full h-96 border rounded" title="Resume Preview" />
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No resume uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a resume from the admin panel to preview it here
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
