"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building } from "lucide-react"

interface Experience {
  id: string
  company_name: string
  position: string
  duration: string
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

function formatDateRange(
  startMonth: number,
  startYear: number,
  endMonth?: number,
  endYear?: number,
  isCurrent?: boolean,
) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const startDate = `${months[startMonth - 1]} ${startYear}`

  if (isCurrent) {
    return `${startDate} - Present`
  }

  if (endMonth && endYear) {
    const endDate = `${months[endMonth - 1]} ${endYear}`
    return `${startDate} - ${endDate}`
  }

  return startDate
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experience")
      if (response.ok) {
        const data = await response.json()
        setExperiences(data.filter((exp: Experience) => exp.is_visible))
      }
    } catch (error) {
      console.error("Error fetching experiences:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Experience</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (experiences.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Experience</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <Card className="border-primary/20 bg-card">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Fresh Graduate Ready to Excel</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and work experience in business analysis and data-driven solutions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experiences.map((experience) => (
            <Card key={experience.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{experience.position}</h3>
                    <div className="flex items-center gap-2 text-primary font-medium mb-2">
                      <Building className="h-4 w-4" />
                      {experience.company_name}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    {experience.is_current && (
                      <Badge variant="default" className="w-fit">
                        Current
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDateRange(
                        experience.start_month,
                        experience.start_year,
                        experience.end_month,
                        experience.end_year,
                        experience.is_current,
                      )}
                    </div>
                    {experience.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {experience.location}
                      </div>
                    )}
                  </div>
                </div>
                {experience.description && (
                  <p className="text-muted-foreground leading-relaxed">{experience.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
