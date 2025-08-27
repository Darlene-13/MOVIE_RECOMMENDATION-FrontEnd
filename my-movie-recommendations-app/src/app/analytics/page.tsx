"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { StatsCard } from "@/components/analytics/stats-card"
import { GenreChart } from "@/components/analytics/genre-chart"
import { ActivityChart } from "@/components/analytics/activity-chart"
import { RatingDistributionChart } from "@/components/analytics/rating-distribution"
import { RecentActivityList } from "@/components/analytics/recent-activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnalyticsService, type ViewingStats, type ComparisonStats } from "@/lib/analytics"
import { Film, Clock, Star, TrendingUp, Calendar, ArrowLeft, Trophy, Target, Zap } from "lucide-react"
import { Link } from "react-router-dom"

export default function AnalyticsPage() {
  const [viewingStats, setViewingStats] = useState<ViewingStats | null>(null)
  const [comparisonStats, setComparisonStats] = useState<ComparisonStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [viewing, comparison] = await Promise.all([
        AnalyticsService.getViewingStats(),
        AnalyticsService.getComparisonStats(),
      ])
      setViewingStats(viewing)
      setComparisonStats(comparison)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}d ${hours % 24}h`
    return `${hours}h ${minutes % 60}m`
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!viewingStats || !comparisonStats) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">No Data Available</h2>
            <p className="text-muted-foreground">Start watching movies to see your analytics!</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
                  <p className="text-muted-foreground">Insights into your movie watching habits</p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {viewingStats.watchingStreak} day streak
              </Badge>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Movies Watched"
              value={viewingStats.totalMoviesWatched}
              subtitle="Total movies in your collection"
              icon={Film}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Watch Time"
              value={formatWatchTime(viewingStats.totalWatchTime)}
              subtitle="Total time spent watching"
              icon={Clock}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Average Rating"
              value={`${viewingStats.averageRating}/5`}
              subtitle="Your average movie rating"
              icon={Star}
              trend={{ value: 3, isPositive: true }}
            />
            <StatsCard
              title="Watching Streak"
              value={`${viewingStats.watchingStreak} days`}
              subtitle="Current consecutive days"
              icon={Calendar}
              trend={{ value: 15, isPositive: true }}
            />
          </div>

          {/* Comparison Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your vs Global Average</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your Rating</span>
                    <Badge variant="secondary">{comparisonStats.userAverage}/5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Global Average</span>
                    <Badge variant="outline">{comparisonStats.globalAverage}/5</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    You rate{" "}
                    {(
                      ((comparisonStats.userAverage - comparisonStats.globalAverage) * 100) /
                      comparisonStats.globalAverage
                    ).toFixed(1)}
                    % higher than average
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Genre Preference</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your Favorite</span>
                    <Badge variant="secondary">{comparisonStats.userGenrePreference}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Most Popular</span>
                    <Badge variant="outline">{comparisonStats.popularGenre}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {comparisonStats.userGenrePreference === comparisonStats.popularGenre
                      ? "You're in sync with popular taste!"
                      : "You have unique taste!"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Activity Level</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground mb-2">
                  {viewingStats.totalMoviesWatched > 100
                    ? "High"
                    : viewingStats.totalMoviesWatched > 50
                      ? "Medium"
                      : "Low"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {viewingStats.totalMoviesWatched} movies watched
                </div>
                <div className="mt-2">
                  <Badge variant={viewingStats.totalMoviesWatched > 100 ? "default" : "secondary"}>
                    {viewingStats.totalMoviesWatched > 100 ? "Movie Enthusiast" : "Casual Viewer"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GenreChart data={viewingStats.favoriteGenres} />
            <RatingDistributionChart data={viewingStats.ratingDistribution} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityChart data={viewingStats.monthlyActivity} />
            </div>
            <RecentActivityList activities={viewingStats.recentActivity} />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
