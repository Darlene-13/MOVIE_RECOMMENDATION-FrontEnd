"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { NotificationService, type Notification, type NotificationPreferences } from "@/lib/notifications"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences | null
  isLoading: boolean
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  updatePreferences: (preferences: NotificationPreferences) => Promise<void>
  showToast: (title: string, message: string, type?: "success" | "error" | "info") => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; message: string; type: string }>>([])

  const refreshNotifications = useCallback(async () => {
    try {
      const [notifs, prefs] = await Promise.all([
        NotificationService.getNotifications(),
        NotificationService.getPreferences(),
      ])
      setNotifications(notifs)
      setPreferences(prefs)
    } catch (error) {
      console.error("Failed to refresh notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshNotifications()

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(refreshNotifications, 30000)
    return () => clearInterval(interval)
  }, [refreshNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId)
      setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await NotificationService.updatePreferences(newPreferences)
      setPreferences(newPreferences)
    } catch (error) {
      console.error("Failed to update preferences:", error)
    }
  }

  const showToast = (title: string, message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const value = {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    showToast,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg backdrop-blur-sm border max-w-sm animate-in slide-in-from-right-full ${
              toast.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : toast.type === "error"
                  ? "bg-red-500/90 border-red-400 text-white"
                  : "bg-card/90 border-border text-card-foreground"
            }`}
          >
            <h4 className="font-semibold text-sm">{toast.title}</h4>
            <p className="text-sm opacity-90">{toast.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
