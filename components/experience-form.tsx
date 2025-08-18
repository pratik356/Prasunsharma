"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit } from "lucide-react"
import { createExperience, updateExperience } from "@/lib/admin-actions"

interface Experience {
  id?: string
  company_name: string
  position: string
  description: string
  location: string
  is_current: boolean
  start_month: number
  start_year: number
  end_month?: number
  end_year?: number
  is_visible: boolean
  display_order: number
}

interface ExperienceFormProps {
  experience?: Experience
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

export default function ExperienceForm({ experience }: ExperienceFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Experience>({
    company_name: experience?.company_name || "",
    position: experience?.position || "",
    description: experience?.description || "",
    location: experience?.location || "",
    is_current: experience?.is_current || false,
    start_month: experience?.start_month || 1,
    start_year: experience?.start_year || currentYear,
    end_month: experience?.end_month || undefined,
    end_year: experience?.end_year || undefined,
    is_visible: experience?.is_visible ?? true,
    display_order: experience?.display_order || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formDataObj.append(key, value ? "on" : "off")
        } else if (value !== undefined && value !== null) {
          formDataObj.append(key, value.toString())
        }
      })

      if (experience?.id) {
        await updateExperience(experience.id, formDataObj)
      } else {
        await createExperience(formDataObj)
      }

      setOpen(false)
    } catch (error) {
      console.error("Error saving experience:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={experience ? "sm" : "default"} variant={experience ? "outline" : "default"}>
          {experience ? (
            <>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{experience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Start Date *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_month">Month</Label>
                <Select
                  value={formData.start_month.toString()}
                  onValueChange={(value) => setFormData({ ...formData, start_month: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_year">Year</Label>
                <Select
                  value={formData.start_year.toString()}
                  onValueChange={(value) => setFormData({ ...formData, start_year: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {!formData.is_current && (
            <div className="space-y-4">
              <Label>End Date</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="end_month">Month</Label>
                  <Select
                    value={formData.end_month?.toString() || ""}
                    onValueChange={(value) => setFormData({ ...formData, end_month: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_year">Year</Label>
                  <Select
                    value={formData.end_year?.toString() || ""}
                    onValueChange={(value) => setFormData({ ...formData, end_year: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Remote, New York, NY"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your role and responsibilities..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_current"
              checked={formData.is_current}
              onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked })}
            />
            <Label htmlFor="is_current">This is my current position</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_visible"
              checked={formData.is_visible}
              onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
            />
            <Label htmlFor="is_visible">Show in portfolio</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : experience ? "Update Experience" : "Add Experience"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
