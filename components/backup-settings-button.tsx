"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { backupSettings } from "@/lib/admin-actions"

export default function BackupSettingsButton() {
  const [isBackingUp, setIsBackingUp] = useState(false)

  async function handleBackup() {
    setIsBackingUp(true)

    try {
      const result = await backupSettings()

      if (result.success && result.data) {
        // Create and download backup file
        const dataStr = JSON.stringify(result.data, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `settings-backup-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        alert(result.error || "Failed to backup settings")
      }
    } catch (error) {
      alert("Failed to backup settings")
    } finally {
      setIsBackingUp(false)
    }
  }

  return (
    <Button variant="outline" className="w-full bg-transparent" onClick={handleBackup} disabled={isBackingUp}>
      {isBackingUp ? "Creating Backup..." : "Backup Settings"}
    </Button>
  )
}
