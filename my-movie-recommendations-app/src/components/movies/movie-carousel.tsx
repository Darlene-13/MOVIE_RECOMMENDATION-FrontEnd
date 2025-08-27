"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/movies"

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  onMoviePlay?: (movie: Movie) => void
  onAddToWatchlist?: (movie: Movie) => void
  onRate?: (movie: Movie, rating: number) => void
}

export function MovieCarousel({ title, movies, onMoviePlay, onAddToWatchlist, onRate }: MovieCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return

    const scrollAmount = 320 // Width of one card plus gap
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(scrollRef.current.scrollWidth - scrollRef.current.clientWidth, scrollPosition + scrollAmount)

    scrollRef.current.scrollTo({ left: newPosition, behavior: "smooth" })
    setScrollPosition(newPosition)
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = scrollRef.current
    ? scrollPosition < scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    : true

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onPlay={onMoviePlay}
            onAddToWatchlist={onAddToWatchlist}
            onRate={onRate}
            className="flex-shrink-0 w-72"
          />
        ))}
      </div>
    </div>
  )
}
