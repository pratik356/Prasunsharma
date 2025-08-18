"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProject, updateProject } from "@/lib/admin-actions"
import { Save, X, Upload } from "lucide-react"
import { ImageIcon } from "lucide-react"
import type { Project } from "@/lib/database"

interface ProjectFormProps {
  project?: Project
  onCancel: () => void
}

export default function ProjectForm({ project, onCancel }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>(project?.image_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      // Upload image if a new file was selected
      if (imageFile) {
        setIsUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          formData.set("image_url", url)
        }
        setIsUploading(false)
      }

      if (project) {
        await updateProject(project.id, formData)
      } else {
        await createProject(formData)
      }
      onCancel()
    } catch (error) {
      console.error("Error saving project:", error)
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? "Edit Project" : "Add New Project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={project?.title} placeholder="Project title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                defaultValue={project?.category}
                placeholder="e.g., Analytics, Machine Learning"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project?.description}
              placeholder="Brief description for project cards"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="long_description">Detailed Description</Label>
            <Textarea
              id="long_description"
              name="long_description"
              defaultValue={project?.long_description}
              placeholder="Detailed project description"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies</Label>
            <Input
              id="technologies"
              name="technologies"
              defaultValue={project?.technologies?.join(", ")}
              placeholder="Python, Tableau, SQL (comma-separated)"
            />
          </div>

          <div className="space-y-4">
            <Label>Project Image</Label>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-muted/50">
                  {imagePreview ? (
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No image selected</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={imagePreview}
                    onChange={(e) => setImagePreview(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Or upload a new image</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                defaultValue={project?.github_url}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input
                id="live_url"
                name="live_url"
                type="url"
                defaultValue={project?.live_url}
                placeholder="https://project-demo.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                defaultValue={project?.display_order || 0}
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_visible" name="is_visible" defaultChecked={project?.is_visible ?? true} />
              <Label htmlFor="is_visible">Visible on portfolio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_featured" name="is_featured" defaultChecked={project?.is_featured ?? false} />
              <Label htmlFor="is_featured">Featured project</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : isUploading ? "Uploading..." : "Save Project"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
