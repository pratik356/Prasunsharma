"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteContactInfo } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"

interface ContactDeleteButtonProps {
  contact: {
    id: string
    display_label: string
  }
  children: React.ReactNode
}

export default function ContactDeleteButton({ contact, children }: ContactDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteContactInfo(contact.id)
      if (result?.error) {
        console.error("Error deleting contact info:", result.error)
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting contact info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact Information</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{contact.display_label}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
