"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface ContactVisibilityToggleProps {
  contact: {
    id: string
    is_visible: boolean
  }
  children: React.ReactNode
}

export default function ContactVisibilityToggle({ contact, children }: ContactVisibilityToggleProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      // Create a form to submit the toggle action
      const formData = new FormData()
      formData.append("id", contact.id)
      formData.append("is_visible", contact.is_visible.toString())

      const response = await fetch("/api/admin/contact/toggle-visibility", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error toggling visibility:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleToggle} disabled={isLoading}>
      {children}
    </button>
  )
}
