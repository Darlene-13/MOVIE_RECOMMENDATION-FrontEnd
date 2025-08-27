"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Info, Star } from "lucide-react"
import type { Movie } from "@/lib/movies"

interface HeroMovieProps {
  movies: Movie[]
  onPlay?: (movie: Movie) => void
  onAddToWatchlist?: (movie: Movie) => void
  onBackgroundChange?: (backdropPath: string) => void
}

export function HeroMovie({ movies, onPlay, onAddToWatchlist, onBackgroundChange }: HeroMovieProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const currentMovie = movies[currentIndex]

  useEffect(() => {
    setIsVisible(true)
    onBackgroundChange?.(currentMovie?.backdrop_path || "")

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [currentIndex, movies, onBackgroundChange])

  if (!currentMovie) return null

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
    return genreIds.slice(0, 3).map((id) => genreMap[id] || "Unknown")
  }

  return (
    <div className="relative h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div
        className={`relative z-10 max-w-2xl px-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            Featured
          </Badge>
          <div className="flex items-center gap-1 text-white">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{currentMovie.vote_average.toFixed(1)}</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">{currentMovie.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {getGenreNames(currentMovie.genre_ids).map((genre) => (
            <Badge key={genre} variant="outline" className="text-white border-white/30">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">{currentMovie.overview}</p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            onClick={() => onPlay?.(currentMovie)}
          >
            <Play className="mr-2 h-5 w-5" />
            Play Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent px-8"
            onClick={() => onAddToWatchlist?.(currentMovie)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add to Watchlist
          </Button>
          <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 px-8">
            <Info className="mr-2 h-5 w-5" />
            More Info
          </Button>
        </div>
      </div>

      {/* Movie Indicators */}
      <div className="absolute bottom-8 left-8 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
