"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import SkillForm from "@/components/skill-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import { toggleSkillVisibility, deleteSkill } from "@/lib/admin-actions"
import type { Skill } from "@/lib/database"

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    try {
      const response = await fetch("/api/skills")
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleVisibility(skill: Skill) {
    await toggleSkillVisibility(skill.id, skill.is_visible)
    fetchSkills()
  }

  async function handleDelete(skill: Skill) {
    if (confirm(`Are you sure you want to delete "${skill.name}"?`)) {
      await deleteSkill(skill.id)
      fetchSkills()
    }
  }

  function handleEdit(skill: Skill) {
    setEditingSkill(skill)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingSkill(null)
    fetchSkills()
  }

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (showForm) {
    return (
      <AdminLayout>
        <SkillForm skill={editingSkill || undefined} onCancel={handleCloseForm} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Skills</h1>
            <p className="text-muted-foreground mt-2">Manage your technical skills and proficiency levels.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>

        {/* Skills by Category */}
        {Object.keys(skillsByCategory).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No skills yet</h3>
                  <p className="text-muted-foreground">Start building your skills portfolio.</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Skill
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category}</span>
                    <Badge variant="secondary">{categorySkills.length} skills</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{skill.name}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={skill.is_visible ? "default" : "secondary"} className="text-xs">
                              {skill.is_visible ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Visible
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1" />
                                  Hidden
                                </>
                              )}
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(skill)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleToggleVisibility(skill)}>
                              {skill.is_visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(skill)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Proficiency</span>
                            <span className="font-medium">{skill.proficiency}%</span>
                          </div>
                          <Progress value={skill.proficiency} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
