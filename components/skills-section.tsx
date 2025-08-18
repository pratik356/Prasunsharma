"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Database, Code, Brain, TrendingUp, PieChart, FileSpreadsheet, Zap } from "lucide-react"

type Skill = {
  id?: string
  name: string
  category: string
  proficiency: number
  display_order?: number
}

const categoryIcons: Record<string, any> = {
  Analytics: BarChart3,
  Programming: Code,
  Database: Database,
  Visualization: PieChart,
  "Machine Learning": Brain,
  "Business Intelligence": TrendingUp,
  Tools: FileSpreadsheet,
  Other: Zap,
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSkills() {
      try {
        const response = await fetch("/api/skills")
        if (!response.ok) {
          throw new Error("Failed to fetch skills")
        }
        const data = await response.json()
        setSkills(data)
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

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

  // Default skills if database is empty
  const defaultSkills = {
    Analytics: [
      { name: "Statistical Analysis", proficiency: 85 },
      { name: "Data Mining", proficiency: 80 },
      { name: "Predictive Modeling", proficiency: 75 },
    ],
    Programming: [
      { name: "Python", proficiency: 90 },
      { name: "R", proficiency: 85 },
      { name: "SQL", proficiency: 88 },
    ],
    Visualization: [
      { name: "Tableau", proficiency: 85 },
      { name: "Power BI", proficiency: 80 },
      { name: "Excel", proficiency: 95 },
    ],
    Tools: [
      { name: "Jupyter", proficiency: 90 },
      { name: "Git", proficiency: 75 },
      { name: "SPSS", proficiency: 70 },
    ],
  }

  const displaySkills = Object.keys(skillsByCategory).length > 0 ? skillsByCategory : defaultSkills

  if (loading) {
    return (
      <section id="skills" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive toolkit for transforming data into strategic business value
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(displaySkills).map(([category, categorySkills]) => {
            const IconComponent = categoryIcons[category] || Zap

            return (
              <Card key={category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySkills.map((skill, index) => (
                    <div key={skill.name || index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{skill.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {skill.proficiency}%
                        </Badge>
                      </div>
                      <Progress value={skill.proficiency} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
