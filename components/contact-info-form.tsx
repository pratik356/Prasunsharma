"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createContactInfo, updateContactInfo } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"

interface ContactInfoFormProps {
  contact?: {
    id: string
    field_name: string
    display_label: string
    field_value: string
    icon: string | null
    is_visible: boolean
    display_order: number
  }
  children: React.ReactNode
}

export default function ContactInfoForm({ contact, children }: ContactInfoFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      let result
      if (contact) {
        result = await updateContactInfo(contact.id, formData)
      } else {
        result = await createContactInfo(formData)
      }

      if (result?.error) {
        console.error("Error saving contact info:", result.error)
      } else {
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error saving contact info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact Information" : "Add Contact Information"}</DialogTitle>
          <DialogDescription>
            {contact ? "Update your contact details." : "Add a new way for visitors to contact you."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="field_name">Field Name</Label>
            <Input
              id="field_name"
              name="field_name"
              defaultValue={contact?.field_name || ""}
              placeholder="e.g., email, phone, linkedin"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_label">Display Label</Label>
            <Input
              id="display_label"
              name="display_label"
              defaultValue={contact?.display_label || ""}
              placeholder="e.g., Email Address, Phone Number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_value">Value</Label>
            <Input
              id="field_value"
              name="field_value"
              defaultValue={contact?.field_value || ""}
              placeholder="e.g., your@email.com, +1234567890"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (optional)</Label>
            <Input id="icon" name="icon" defaultValue={contact?.icon || ""} placeholder="e.g., mail, phone, linkedin" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              name="display_order"
              type="number"
              defaultValue={contact?.display_order || 0}
              min="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_visible" name="is_visible" defaultChecked={contact?.is_visible ?? true} />
            <Label htmlFor="is_visible">Visible on portfolio</Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : contact ? "Update Contact" : "Add Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
