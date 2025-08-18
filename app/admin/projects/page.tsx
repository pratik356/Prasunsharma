"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin-layout"
import ProjectForm from "@/components/project-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, EyeOff, Star, StarOff, Trash2 } from "lucide-react"
import { toggleProjectVisibility, toggleProjectFeatured, deleteProject } from "@/lib/admin-actions"
import type { Project } from "@/lib/database"

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleVisibility(project: Project) {
    await toggleProjectVisibility(project.id, project.is_visible)
    fetchProjects()
  }

  async function handleToggleFeatured(project: Project) {
    await toggleProjectFeatured(project.id, project.is_featured)
    fetchProjects()
  }

  async function handleDelete(project: Project) {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      await deleteProject(project.id)
      fetchProjects()
    }
  }

  function handleEdit(project: Project) {
    setEditingProject(project)
    setShowForm(true)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditingProject(null)
    fetchProjects()
  }

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
        <ProjectForm project={editingProject || undefined} onCancel={handleCloseForm} />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-2">Manage your portfolio projects and showcase your work.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No projects yet</h3>
                  <p className="text-muted-foreground">Get started by adding your first project.</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image_url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {project.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge variant={project.is_visible ? "default" : "secondary"}>
                      {project.is_visible ? (
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
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {project.category}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.slice(0, 3).map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleFeatured(project)}>
                      {project.is_featured ? <StarOff className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleVisibility(project)}>
                      {project.is_visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(project)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
