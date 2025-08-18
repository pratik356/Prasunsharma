"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FileText, ArrowDown } from "lucide-react"
import ResumePreviewModal from "@/components/resume-preview-modal"

export default function HeroSection() {
  const [profileImage, setProfileImage] = useState<string>("")
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [resumeLoading, setResumeLoading] = useState(true)

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        const response = await fetch("/api/profile")
        if (response.ok) {
          const data = await response.json()
          setProfileImage(data.profile_image_url || "/professional-headshot.png")
        }
      } catch (error) {
        console.error("Error fetching profile image:", error)
        setProfileImage("/professional-headshot.png")
      }
    }

    async function fetchResume() {
      try {
        setResumeLoading(true)
        const response = await fetch("/api/resume")
        if (response.ok) {
          const data = await response.json()
          setResumeUrl(data.resume_url)
        }
      } catch (error) {
        console.error("Error fetching resume:", error)
      } finally {
        setResumeLoading(false)
      }
    }

    fetchProfileImage()
    fetchResume()
  }, [])

  const getResumeButtonText = () => {
    if (resumeLoading) return "Loading..."
    if (resumeUrl) {
      const filename = resumeUrl.split("/").pop() || "Resume"
      return filename.replace(/\.[^/.]+$/, "")
    }
    return "No Resume"
  }

  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground font-medium">Hi! I'm Prasun</p>
              <div className="space-y-2">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="text-foreground">BUSINESS</span>
                </h1>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="text-primary">ANALYST</span>
                </h1>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-muted-foreground">Goal</h2>
              <blockquote className="text-lg leading-relaxed">
                <span className="text-muted-foreground">"The goal is to turn </span>
                <span className="font-semibold text-foreground">Data</span>
                <span className="text-muted-foreground"> into </span>
                <span className="font-semibold text-foreground">Information</span>
                <span className="text-muted-foreground"> & </span>
                <span className="font-semibold text-foreground">Information</span>
                <span className="text-muted-foreground"> into </span>
                <span className="font-semibold text-foreground">Insight</span>
                <span className="text-muted-foreground">"</span>
              </blockquote>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base"
                onClick={() => setShowResumeModal(true)}
                disabled={resumeLoading}
                variant={resumeUrl ? "default" : "outline"}
              >
                <FileText className="mr-2 h-4 w-4" />
                {getResumeButtonText()}
              </Button>
              <Button variant="outline" size="lg" className="text-base bg-transparent">
                <a href="#about" className="flex items-center">
                  Learn More
                  <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20">
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Prasun Sharma - Business Analyst"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/60 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      <ResumePreviewModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />
    </>
  )
}
