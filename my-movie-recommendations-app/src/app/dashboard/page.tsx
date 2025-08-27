"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { HeroMovie } from "@/components/movies/hero-movie"
import { MovieCarousel } from "@/components/movies/movie-carousel"
import { EnhancedSearch } from "@/components/movies/enhanced-search"
import { MovieDetailsModal } from "@/components/movies/movie-details-modal"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { MovieService, type Movie, type MovieRecommendations } from "@/lib/movies"
import { LogOut, User, BarChart3, Bookmark } from "lucide-react"
import { Link } from "react-router-dom"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [recommendations, setRecommendations] = useState<MovieRecommendations | null>(null)
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    try {
      const data = await MovieService.getRecommendations()
      setRecommendations(data)
      setBackgroundImage(data.trending[0]?.backdrop_path || "")
    } catch (error) {
      console.error("Failed to load recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await MovieService.searchMovies(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    }
  }

  const handleMoviePlay = (movie: Movie) => {
    console.log("Playing movie:", movie.title)
    // Implement movie player logic
  }

  const handleMovieDetails = (movieId: number) => {
    setSelectedMovieId(movieId)
    setIsModalOpen(true)
  }

  const handleMovieSelect = (movie: Movie) => {
    handleMovieDetails(movie.id)
  }

  const handleAddToWatchlist = async (movie: Movie) => {
    try {
      await MovieService.addToWatchlist(movie.id)
      console.log("Added to watchlist:", movie.title)
    } catch (error) {
      console.error("Failed to add to watchlist:", error)
    }
  }

  const handleRateMovie = async (movie: Movie, rating: number) => {
    try {
      await MovieService.rateMovie(movie.id, rating)
      console.log("Rated movie:", movie.title, rating)
    } catch (error) {
      console.error("Failed to rate movie:", error)
    }
  }

  const handleBackgroundChange = (backdropPath: string) => {
    setBackgroundImage(backdropPath)
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Dynamic Background */}
        <div
          className="fixed inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: backgroundImage
              ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${backgroundImage})`
              : "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <header className="flex items-center justify-between p-6 bg-background/10 backdrop-blur-sm border-b border-border/20">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">CineAI</h1>
              <EnhancedSearch onSearch={handleSearch} onMovieSelect={handleMovieSelect} className="w-96 max-w-md" />
            </div>

            <div className="flex items-center gap-4">
              <Link to="/watchlist">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <NotificationBell />
              <div className="flex items-center gap-2 text-white">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="pb-12">
            {isSearching ? (
              /* Search Results */
              <div className="px-8 py-6">
                <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.map((movie) => (
                    <div key={movie.id} className="w-full">
                      <div
                        className="bg-card/80 backdrop-blur-sm rounded-lg p-4 text-white cursor-pointer hover:bg-card/90 transition-colors"
                        onClick={() => handleMovieDetails(movie.id)}
                      >
                        <h3 className="font-semibold">{movie.title}</h3>
                        <p className="text-sm text-white/70">{movie.release_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Recommendations */
              <>
                {/* Hero Section */}
                {recommendations?.trending && (
                  <HeroMovie
                    movies={recommendations.trending}
                    onPlay={handleMoviePlay}
                    onAddToWatchlist={handleAddToWatchlist}
                    onBackgroundChange={handleBackgroundChange}
                  />
                )}

                {/* Movie Carousels */}
                <div className="px-8 space-y-12 mt-12">
                  {recommendations?.forYou && (
                    <MovieCarousel
                      title="Recommended for You"
                      movies={recommendations.forYou}
                      onMoviePlay={handleMoviePlay}
                      onAddToWatchlist={handleAddToWatchlist}
                      onRate={handleRateMovie}
                    />
                  )}

                  {recommendations?.newReleases && (
                    <MovieCarousel
                      title="New Releases"
                      movies={recommendations.newReleases}
                      onMoviePlay={handleMoviePlay}
                      onAddToWatchlist={handleAddToWatchlist}
                      onRate={handleRateMovie}
                    />
                  )}

                  {recommendations?.byGenre &&
                    Object.entries(recommendations.byGenre).map(([genre, movies]) => (
                      <MovieCarousel
                        key={genre}
                        title={`${genre} Movies`}
                        movies={movies}
                        onMoviePlay={handleMoviePlay}
                        onAddToWatchlist={handleAddToWatchlist}
                        onRate={handleRateMovie}
                      />
                    ))}
                </div>
              </>
            )}
          </main>
        </div>

        {/* Movie Details Modal */}
        <MovieDetailsModal
          movieId={selectedMovieId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedMovieId(null)
          }}
          onPlay={handleMoviePlay}
        />
      </div>
    </ProtectedRoute>
  )
}
