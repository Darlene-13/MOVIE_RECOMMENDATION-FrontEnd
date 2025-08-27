"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Plus, Check } from "lucide-react"
import type { Movie } from "@/lib/movies"

interface MovieCardProps {
  movie: Movie
  onPlay?: (movie: Movie) => void
  onAddToWatchlist?: (movie: Movie) => void
  onRate?: (movie: Movie, rating: number) => void
  isInWatchlist?: boolean
  className?: string
}

export function MovieCard({
  movie,
  onPlay,
  onAddToWatchlist,
  onRate,
  isInWatchlist = false,
  className = "",
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [userRating, setUserRating] = useState(0)

  const handleRating = (rating: number) => {
    setUserRating(rating)
    onRate?.(movie, rating)
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
    return genreIds.slice(0, 2).map((id) => genreMap[id] || "Unknown")
  }

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster_path || "/placeholder.svg?height=600&width=400&query=movie poster"}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />

        {/* Action Buttons */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <Button
            size="lg"
            className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm"
            onClick={() => onPlay?.(movie)}
          >
            <Play className="mr-2 h-5 w-5" />
            Play
          </Button>
        </div>

        {/* Top Right Actions */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            onClick={() => onAddToWatchlist?.(movie)}
          >
            {isInWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>

        {/* Rating */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-1">{movie.title}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {getGenreNames(movie.genre_ids).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{movie.overview}</p>

        {/* User Rating */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2">Rate:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className="text-muted-foreground hover:text-yellow-400 transition-colors"
            >
              <Star className={`h-4 w-4 ${star <= userRating ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
