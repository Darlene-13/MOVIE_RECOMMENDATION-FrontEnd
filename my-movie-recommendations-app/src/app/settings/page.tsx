"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { NotificationSettings } from "@/components/notifications/notification-settings"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {Link} from "react-router-dom"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account and notification preferences</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-8">
          <NotificationSettings />
        </main>
      </div>
    </ProtectedRoute>
  )
}
