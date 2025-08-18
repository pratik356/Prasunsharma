"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "@/lib/actions"
import {
  LayoutDashboard,
  User,
  Briefcase,
  Award,
  Mail,
  FileText,
  Settings,
  LogOut,
  Menu,
  Home,
  Building,
  FileDown,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Experience", href: "/admin/experience", icon: Building },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Skills", href: "/admin/skills", icon: Award },
  { name: "Resume", href: "/admin/resume", icon: FileDown },
  { name: "Contact Info", href: "/admin/contact", icon: Mail },
  { name: "Portfolio Sections", href: "/admin/sections", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-card border-r border-border overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PS</span>
              </div>
              <span className="font-semibold text-lg">Admin Panel</span>
            </div>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-4 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-4"
              >
                <Home className="h-4 w-4" />
                View Portfolio
              </Link>
              <NavItems />
            </nav>
            <div className="px-4 pb-4">
              <form action={signOut}>
                <Button variant="ghost" type="submit" className="w-full justify-start">
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-card border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PS</span>
            </div>
            <span className="font-semibold text-lg">Admin</span>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 mb-8">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">PS</span>
                  </div>
                  <span className="font-semibold text-lg">Admin Panel</span>
                </div>
                <nav className="flex-1 space-y-2">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-4"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    View Portfolio
                  </Link>
                  <NavItems />
                </nav>
                <div className="pt-4">
                  <form action={signOut}>
                    <Button variant="ghost" type="submit" className="w-full justify-start">
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
