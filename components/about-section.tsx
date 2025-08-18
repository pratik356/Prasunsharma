import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Briefcase, Target } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate Business Analytics student with a drive to transform complex data into actionable business
            insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              I'm a dedicated Business Analytics student with a passion for uncovering meaningful patterns in data. My
              journey combines analytical thinking with business acumen to solve real-world challenges.
            </p>
            <p className="text-lg leading-relaxed">
              Through my studies and projects, I've developed expertise in statistical analysis, data visualization, and
              business intelligence tools. I believe that every dataset tells a story, and I'm here to help
              organizations discover and act on those stories.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 pt-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Education</h3>
                  <p className="text-sm text-muted-foreground">Business Analytics Student</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Briefcase className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Experience</h3>
                  <p className="text-sm text-muted-foreground">Data Analysis Projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">Focus</h3>
                  <p className="text-sm text-muted-foreground">Business Intelligence</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/business-analytics-workspace.png"
                alt="Business Analytics Workspace"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
