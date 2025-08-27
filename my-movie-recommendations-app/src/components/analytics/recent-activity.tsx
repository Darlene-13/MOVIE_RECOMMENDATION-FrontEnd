import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Plus } from "lucide-react"
import type { RecentActivity } from "@/lib/analytics"

interface RecentActivityProps {
  activities: RecentActivity[]
}

export function RecentActivityList({ activities }: RecentActivityProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "watched":
        return <Play className="h-4 w-4" />
      case "rated":
        return <Star className="h-4 w-4" />
      case "added_to_watchlist":
        return <Plus className="h-4 w-4" />
      default:
        return null
    }
  }

  const getActionText = (activity: RecentActivity) => {
    switch (activity.action) {
      case "watched":
        return `Watched "${activity.movieTitle}"`
      case "rated":
        return `Rated "${activity.movieTitle}" ${activity.rating} stars`
      case "added_to_watchlist":
        return `Added "${activity.movieTitle}" to watchlist`
      default:
        return activity.movieTitle
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "watched":
        return "bg-green-500/10 text-green-500"
      case "rated":
        return "bg-yellow-500/10 text-yellow-500"
      case "added_to_watchlist":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{getActionText(activity)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {activity.action.replace("_", " ")}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
