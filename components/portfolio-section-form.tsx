"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updatePortfolioSection } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"

interface PortfolioSectionFormProps {
  section?: {
    id: string
    section_name: string
    title: string | null
    subtitle: string | null
    content: string | null
    is_visible: boolean
  }
  children: React.ReactNode
}

export default function PortfolioSectionForm({ section, children }: PortfolioSectionFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    if (!section) return

    setIsLoading(true)
    try {
      const result = await updatePortfolioSection(section.id, formData)
      if (result?.error) {
        console.error("Error updating section:", result.error)
      } else {
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating section:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Portfolio Section</DialogTitle>
          <DialogDescription>Update the content for the {section?.section_name} section.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={section?.title || ""} placeholder="Section title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              defaultValue={section?.subtitle || ""}
              placeholder="Section subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={section?.content || ""}
              placeholder="Section content"
              rows={6}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_visible" name="is_visible" defaultChecked={section?.is_visible} />
            <Label htmlFor="is_visible">Visible on portfolio</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Section"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
