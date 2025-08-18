"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSkill, updateSkill } from "@/lib/admin-actions"
import { Save, X } from "lucide-react"
import type { Skill } from "@/lib/database"

interface SkillFormProps {
  skill?: Skill
  onCancel: () => void
}

export default function SkillForm({ skill, onCancel }: SkillFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [proficiency, setProficiency] = useState(skill?.proficiency || 50)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      formData.set("proficiency", proficiency.toString())
      if (skill) {
        await updateSkill(skill.id, formData)
      } else {
        await createSkill(formData)
      }
      onCancel()
    } catch (error) {
      console.error("Error saving skill:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{skill ? "Edit Skill" : "Add New Skill"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input id="name" name="name" defaultValue={skill?.name} placeholder="e.g., Python, Tableau" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                defaultValue={skill?.category}
                placeholder="e.g., Programming, Analytics"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Proficiency Level: {proficiency}%</Label>
            <Slider
              value={[proficiency]}
              onValueChange={(value) => setProficiency(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" name="icon" defaultValue={skill?.icon} placeholder="Icon name or class" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                name="display_order"
                type="number"
                defaultValue={skill?.display_order || 0}
                min="0"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch id="is_visible" name="is_visible" defaultChecked={skill?.is_visible ?? true} />
              <Label htmlFor="is_visible">Visible</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Skill"}
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
