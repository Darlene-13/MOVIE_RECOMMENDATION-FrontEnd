"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BellRing, Check, CheckCheck, Trash2, Settings, Film, Star, Trophy, Users, Info } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"
import type { Notification } from "@/lib/notifications"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications()

  const [filter, setFilter] = useState<"all" | "unread">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_release":
        return <Film className="h-4 w-4" />
      case "recommendation":
        return <Star className="h-4 w-4" />
      case "achievement":
        return <Trophy className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      case "system":
        return <Info className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_release":
        return "text-blue-500"
      case "recommendation":
        return "text-yellow-500"
      case "achievement":
        return "text-purple-500"
      case "social":
        return "text-green-500"
      case "system":
        return "text-gray-500"
      default:
        return "text-muted-foreground"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fixed right-4 top-16 w-96 max-h-[80vh] bg-card border border-border rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "unread")}>
            <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-96">
              <TabsContent value={filter} className="mt-0 px-4 pb-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                        getIcon={getNotificationIcon}
                        getColor={getNotificationColor}
                        formatTime={formatTimestamp}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  getIcon: (type: string) => React.ReactNode
  getColor: (type: string) => string
  formatTime: (timestamp: string) => string
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getIcon,
  getColor,
  formatTime,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
        notification.read ? "bg-muted/30 border-border/50" : "bg-accent/10 border-accent/30 shadow-sm"
      } hover:bg-accent/20`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full bg-background ${getColor(notification.type)}`}>
          {getIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-1">{notification.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatTime(notification.timestamp)}</p>
            </div>

            {isHovered && (
              <div className="flex items-center gap-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMarkAsRead(notification.id)
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(notification.id)
                  }}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {notification.metadata?.moviePoster && (
            <div className="mt-2">
              <img
                src={notification.metadata.moviePoster || "/placeholder.svg"}
                alt={notification.metadata.movieTitle}
                className="w-12 h-16 object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
