"use client"

import type React from "react"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, User, Save } from "lucide-react"

export default function AdminProfile() {
  const [profileImage, setProfileImage] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchProfileImage()
  }, [])

  async function fetchProfileImage() {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfileImage(data.profile_image_url || "")
      }
    } catch (error) {
      console.error("Error fetching profile image:", error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      let imageUrl = profileImage

      // Upload new image if selected
      if (imageFile) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          imageUrl = url
        }
        setIsUploading(false)
      }

      // Save profile image URL
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_image_url: imageUrl }),
      })

      if (response.ok) {
        setProfileImage(imageUrl)
        setImageFile(null)
        alert("Profile image updated successfully!")
      }
    } catch (error) {
      console.error("Error saving profile image:", error)
      alert("Error saving profile image")
    } finally {
      setIsSaving(false)
      setIsUploading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your profile image and personal information.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Current Image Preview */}
              <div className="space-y-4">
                <div className="w-64 h-64 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 mx-auto lg:mx-0">
                  <img
                    src={profileImage || "/placeholder.svg?height=400&width=400&query=professional headshot"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center lg:text-left">
                  This image will appear in the hero section of your portfolio
                </p>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                  <div className="text-center space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Upload New Profile Image</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose a professional headshot. Recommended size: 400x400px or larger.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("profile-upload")?.click()}
                        disabled={isUploading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? "Uploading..." : "Choose Image"}
                      </Button>
                    </div>
                  </div>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSave} disabled={isSaving || isUploading} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  {profileImage && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setProfileImage("")
                        setImageFile(null)
                      }}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
