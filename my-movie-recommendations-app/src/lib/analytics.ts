// Analytics service and types
export interface ViewingStats {
  totalMoviesWatched: number
  totalWatchTime: number // in minutes
  averageRating: number
  favoriteGenres: GenreStats[]
  watchingStreak: number
  monthlyActivity: MonthlyActivity[]
  ratingDistribution: RatingDistribution[]
  recentActivity: RecentActivity[]
}

export interface GenreStats {
  genre: string
  count: number
  percentage: number
  averageRating: number
}

export interface MonthlyActivity {
  month: string
  moviesWatched: number
  hoursWatched: number
}

export interface RatingDistribution {
  rating: number
  count: number
}

export interface RecentActivity {
  id: string
  movieTitle: string
  action: "watched" | "rated" | "added_to_watchlist"
  timestamp: string
  rating?: number
}

export interface ComparisonStats {
  userAverage: number
  globalAverage: number
  userGenrePreference: string
  popularGenre: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export class AnalyticsService {
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

  static async getViewingStats(): Promise<ViewingStats> {
    try {
      return await this.fetchWithAuth("/analytics/viewing-stats")
    } catch (error) {
      return this.getMockViewingStats()
    }
  }

  static async getComparisonStats(): Promise<ComparisonStats> {
    try {
      return await this.fetchWithAuth("/analytics/comparison")
    } catch (error) {
      return this.getMockComparisonStats()
    }
  }

  // Mock data for development/fallback
  private static getMockViewingStats(): ViewingStats {
    return {
      totalMoviesWatched: 127,
      totalWatchTime: 15840, // 264 hours
      averageRating: 4.2,
      favoriteGenres: [
        { genre: "Sci-Fi", count: 32, percentage: 25.2, averageRating: 4.5 },
        { genre: "Action", count: 28, percentage: 22.0, averageRating: 4.1 },
        { genre: "Drama", count: 24, percentage: 18.9, averageRating: 4.3 },
        { genre: "Comedy", count: 18, percentage: 14.2, averageRating: 3.9 },
        { genre: "Thriller", count: 15, percentage: 11.8, averageRating: 4.2 },
        { genre: "Horror", count: 10, percentage: 7.9, averageRating: 3.7 },
      ],
      watchingStreak: 12,
      monthlyActivity: [
        { month: "Jan", moviesWatched: 8, hoursWatched: 16 },
        { month: "Feb", moviesWatched: 12, hoursWatched: 24 },
        { month: "Mar", moviesWatched: 15, hoursWatched: 30 },
        { month: "Apr", moviesWatched: 10, hoursWatched: 20 },
        { month: "May", moviesWatched: 18, hoursWatched: 36 },
        { month: "Jun", moviesWatched: 22, hoursWatched: 44 },
        { month: "Jul", moviesWatched: 20, hoursWatched: 40 },
        { month: "Aug", moviesWatched: 14, hoursWatched: 28 },
        { month: "Sep", moviesWatched: 8, hoursWatched: 16 },
      ],
      ratingDistribution: [
        { rating: 1, count: 2 },
        { rating: 2, count: 5 },
        { rating: 3, count: 18 },
        { rating: 4, count: 45 },
        { rating: 5, count: 57 },
      ],
      recentActivity: [
        {
          id: "1",
          movieTitle: "Dune: Part Two",
          action: "watched",
          timestamp: "2024-03-15T20:30:00Z",
          rating: 5,
        },
        {
          id: "2",
          movieTitle: "Oppenheimer",
          action: "rated",
          timestamp: "2024-03-14T18:45:00Z",
          rating: 4,
        },
        {
          id: "3",
          movieTitle: "The Batman",
          action: "added_to_watchlist",
          timestamp: "2024-03-13T15:20:00Z",
        },
        {
          id: "4",
          movieTitle: "Everything Everywhere All at Once",
          action: "watched",
          timestamp: "2024-03-12T21:15:00Z",
          rating: 5,
        },
      ],
    }
  }

  private static getMockComparisonStats(): ComparisonStats {
    return {
      userAverage: 4.2,
      globalAverage: 3.8,
      userGenrePreference: "Sci-Fi",
      popularGenre: "Action",
    }
  }
}
