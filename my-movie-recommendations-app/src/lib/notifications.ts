// Notifications service and types
export interface Notification {
  id: string
  type: "new_release" | "recommendation" | "achievement" | "social" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  metadata?: {
    movieId?: number
    movieTitle?: string
    moviePoster?: string
    achievementType?: string
    userId?: string
    userName?: string
  }
}

export interface NotificationPreferences {
  newReleases: boolean
  recommendations: boolean
  achievements: boolean
  social: boolean
  system: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

export class NotificationService {
  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("cineai_token")

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  static async getNotifications(limit = 20): Promise<Notification[]> {
    try {
      return await this.fetchWithAuth(`/notifications?limit=${limit}`)
    } catch (error) {
      return this.getMockNotifications()
    }
  }

  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/notifications/${notificationId}/read`, {
        method: "POST",
      })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  static async markAllAsRead(): Promise<void> {
    try {
      await this.fetchWithAuth("/notifications/read-all", {
        method: "POST",
      })
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/notifications/${notificationId}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  static async getPreferences(): Promise<NotificationPreferences> {
    try {
      return await this.fetchWithAuth("/notifications/preferences")
    } catch (error) {
      return this.getMockPreferences()
    }
  }

  static async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    try {
      await this.fetchWithAuth("/notifications/preferences", {
        method: "PUT",
        body: JSON.stringify(preferences),
      })
    } catch (error) {
      console.error("Failed to update notification preferences:", error)
    }
  }

  // Mock data for development/fallback
  private static getMockNotifications(): Notification[] {
    return [
      {
        id: "1",
        type: "new_release",
        title: "New Movie Alert!",
        message: "Dune: Part Three is now available to watch",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
        actionUrl: "/movie/123",
        metadata: {
          movieId: 123,
          movieTitle: "Dune: Part Three",
          moviePoster: "/dune-movie-poster-desert-sci-fi.png",
        },
      },
      {
        id: "2",
        type: "recommendation",
        title: "Perfect Match Found!",
        message: "Based on your love for sci-fi, we think you'll enjoy 'Blade Runner 2049'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: false,
        actionUrl: "/movie/456",
        metadata: {
          movieId: 456,
          movieTitle: "Blade Runner 2049",
          moviePoster: "/blade-runner-2049-poster.png",
        },
      },
      {
        id: "3",
        type: "achievement",
        title: "Achievement Unlocked!",
        message: "Congratulations! You've watched 100 movies. You're now a Cinema Enthusiast!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        read: true,
        metadata: {
          achievementType: "cinema_enthusiast",
        },
      },
      {
        id: "4",
        type: "social",
        title: "Friend Activity",
        message: "Alex just rated 'The Batman' 5 stars and thinks you'd love it too!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        read: true,
        actionUrl: "/movie/789",
        metadata: {
          userId: "user123",
          userName: "Alex",
          movieId: 789,
          movieTitle: "The Batman",
        },
      },
      {
        id: "5",
        type: "system",
        title: "Weekly Recap Ready",
        message: "Your weekly movie recap is ready! See what you watched this week.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: true,
        actionUrl: "/analytics",
      },
    ]
  }

  private static getMockPreferences(): NotificationPreferences {
    return {
      newReleases: true,
      recommendations: true,
      achievements: true,
      social: true,
      system: false,
      emailNotifications: true,
      pushNotifications: false,
    }
  }
}
