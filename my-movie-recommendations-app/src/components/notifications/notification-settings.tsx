"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/contexts/notification-context"
import { Bell, Mail, Smartphone, Film, Star, Trophy, Users, Info } from "lucide-react"

export function NotificationSettings() {
  const { preferences, updatePreferences, showToast } = useNotifications()
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalPreferences(preferences)
  }, [preferences])

  const handleSave = async () => {
    if (!localPreferences) return

    setIsSaving(true)
    try {
      await updatePreferences(localPreferences)
      showToast("Settings Saved", "Your notification preferences have been updated", "success")
    } catch (error) {
      showToast("Error", "Failed to save notification preferences", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = (key: keyof typeof localPreferences) => {
    if (!localPreferences) return
    setLocalPreferences({
      ...localPreferences,
      [key]: !localPreferences[key],
    })
  }

  if (!localPreferences) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* In-App Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Film className="h-4 w-4 text-blue-500" />
                <div>
                  <Label htmlFor="new-releases">New Releases</Label>
                  <p className="text-sm text-muted-foreground">Get notified about new movie releases</p>
                </div>
              </div>
              <Switch
                id="new-releases"
                checked={localPreferences.newReleases}
                onCheckedChange={() => handleToggle("newReleases")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <div>
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <p className="text-sm text-muted-foreground">Personalized movie suggestions</p>
                </div>
              </div>
              <Switch
                id="recommendations"
                checked={localPreferences.recommendations}
                onCheckedChange={() => handleToggle("recommendations")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="h-4 w-4 text-purple-500" />
                <div>
                  <Label htmlFor="achievements">Achievements</Label>
                  <p className="text-sm text-muted-foreground">Milestone and achievement notifications</p>
                </div>
              </div>
              <Switch
                id="achievements"
                checked={localPreferences.achievements}
                onCheckedChange={() => handleToggle("achievements")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-green-500" />
                <div>
                  <Label htmlFor="social">Social Activity</Label>
                  <p className="text-sm text-muted-foreground">Friend activity and social updates</p>
                </div>
              </div>
              <Switch id="social" checked={localPreferences.social} onCheckedChange={() => handleToggle("social")} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-gray-500" />
                <div>
                  <Label htmlFor="system">System Updates</Label>
                  <p className="text-sm text-muted-foreground">App updates and system messages</p>
                </div>
              </div>
              <Switch id="system" checked={localPreferences.system} onCheckedChange={() => handleToggle("system")} />
            </div>
          </div>
        </div>

        <Separator />

        {/* External Notifications */}
        <div>
          <h3 className="text-lg font-medium mb-4">External Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <Label htmlFor="email">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                id="email"
                checked={localPreferences.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-green-600" />
                <div>
                  <Label htmlFor="push">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
              </div>
              <Switch
                id="push"
                checked={localPreferences.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
