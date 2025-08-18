"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react"

type ContactInfo = {
  field_name: string
  display_label: string
  field_value: string
  icon: string
}

const contactIcons: Record<string, any> = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  linkedin: Linkedin,
  github: Github,
}

export default function ContactSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await fetch("/api/contact")
        if (!response.ok) {
          throw new Error("Failed to fetch contact info")
        }
        const data = await response.json()
        setContactInfo(data)
      } catch (error) {
        console.error("Error fetching contact info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  // Default contact info if database is empty
  const defaultContactInfo = [
    {
      field_name: "email",
      display_label: "Email",
      field_value: "prasun.sharma@email.com",
      icon: "email",
    },
    {
      field_name: "phone",
      display_label: "Phone",
      field_value: "+1 (555) 123-4567",
      icon: "phone",
    },
    {
      field_name: "location",
      display_label: "Location",
      field_value: "New York, NY",
      icon: "location",
    },
    {
      field_name: "linkedin",
      display_label: "LinkedIn",
      field_value: "linkedin.com/in/prasun-sharma",
      icon: "linkedin",
    },
  ]

  const displayContactInfo = contactInfo.length > 0 ? contactInfo : defaultContactInfo

  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to turn your data into actionable insights? Let's discuss your next project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                {displayContactInfo.map((info, index) => {
                  const IconComponent = contactIcons[info.icon] || Mail

                  return (
                    <div key={info.field_name || index} className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{info.display_label}</p>
                        <p className="text-muted-foreground">{info.field_value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Let's Connect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  I'm always interested in discussing new opportunities, collaborations, or just chatting about data
                  analytics and business intelligence.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:prasun.sharma@email.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Me
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://linkedin.com/in/prasun-sharma" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Tell me about your project or question..." rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
