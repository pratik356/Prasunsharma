"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { exportPortfolioData } from "@/lib/admin-actions"

export default function ExportDataButton() {
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport() {
    setIsExporting(true)

    try {
      const result = await exportPortfolioData()

      if (result.success && result.data) {
        // Create and download JSON file
        const dataStr = JSON.stringify(result.data, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `portfolio-data-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else {
        alert(result.error || "Failed to export data")
      }
    } catch (error) {
      alert("Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" className="w-full bg-transparent" onClick={handleExport} disabled={isExporting}>
      {isExporting ? "Exporting..." : "Export Portfolio Data"}
    </Button>
  )
}
