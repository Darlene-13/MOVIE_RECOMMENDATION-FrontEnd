"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Play, Plus, Check, Star, Clock, Calendar, Heart, Share2, X } from "lucide-react"
import { MovieService, type Movie } from "@/lib/movies"
import { useNotifications } from "@/contexts/notification-context"

interface MovieDetailsModalProps {
  movieId: number | null
  isOpen: boolean
  onClose: () => void
  onPlay?: (movie: Movie) => void
}

export function MovieDetailsModal({ movieId, isOpen, onClose, onPlay }: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const { showToast } = useNotifications()

  useEffect(() => {
    if (movieId && isOpen) {
      loadMovieDetails()
    }
  }, [movieId, isOpen])

  const loadMovieDetails = async () => {
    if (!movieId) return

    setIsLoading(true)
    try {
      const movieData = await MovieService.getMovieDetails(movieId)
      setMovie(movieData)
      // In a real app, you'd also load user-specific data like watchlist status
    } catch (error) {
      console.error("Failed to load movie details:", error)
      showToast("Error", "Failed to load movie details", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!movie) return

    try {
      if (isInWatchlist) {
        await MovieService.removeFromWatchlist(movie.id)
        setIsInWatchlist(false)
        showToast("Removed", `${movie.title} removed from watchlist`, "info")
      } else {
        await MovieService.addToWatchlist(movie.id)
        setIsInWatchlist(true)
        showToast("Added", `${movie.title} added to watchlist`, "success")
      }
    } catch (error) {
      showToast("Error", "Failed to update watchlist", "error")
    }
  }

  const handleRating = async (rating: number) => {
    if (!movie) return

    try {
      await MovieService.rateMovie(movie.id, rating)
      setUserRating(rating)
      showToast("Rated", `You rated ${movie.title} ${rating} stars`, "success")
    } catch (error) {
      showToast("Error", "Failed to rate movie", "error")
    }
  }

  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: window.location.href,
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      showToast("Copied", "Movie link copied to clipboard", "success")
    }
  }

  const getGenreNames = (genreIds: number[]) => {
    const genreMap: { [key: number]: string } = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    }
    return genreIds.map((id) => genreMap[id] || "Unknown")
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : movie ? (
          <>
            {/* Hero Section */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={movie.backdrop_path || "/placeholder.svg?height=400&width=800&query=movie backdrop"}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Movie Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end gap-4">
                  <img
                    src={movie.poster_path || "/placeholder.svg?height=200&width=150&query=movie poster"}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-lg"
                  />
                  <div className="flex-1 text-white">
                    <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                      {movie.runtime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatRuntime(movie.runtime)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="max-h-96">
              <div className="p-6 space-y-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button size="lg" onClick={() => onPlay?.(movie)} className="bg-primary hover:bg-primary/90">
                    <Play className="mr-2 h-5 w-5" />
                    Play Now
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleAddToWatchlist}>
                    {isInWatchlist ? <Check className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setIsLiked(!isLiked)}>
                    <Heart className={`mr-2 h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {getGenreNames(movie.genre_ids).map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                </div>

                <Separator />

                {/* Rating Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Rate this movie</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className="text-muted-foreground hover:text-yellow-400 transition-colors"
                      >
                        <Star className={`h-6 w-6 ${star <= userRating ? "fill-yellow-400 text-yellow-400" : ""}`} />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                {movie.director && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Director</h3>
                    <p className="text-muted-foreground">{movie.director}</p>
                  </div>
                )}

                {movie.cast && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cast</h3>
                    <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Movie not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
