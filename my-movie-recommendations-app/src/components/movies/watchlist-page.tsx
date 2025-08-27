"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "./movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MovieService, type Movie } from "@/lib/movies"
import { Search, Filter, SortAsc, SortDesc, Grid, List } from "lucide-react"

interface WatchlistPageProps {
  onMoviePlay?: (movie: Movie) => void
  onMovieDetails?: (movieId: number) => void
}

export function WatchlistPage({ onMoviePlay, onMovieDetails }: WatchlistPageProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "rating" | "date_added">("date_added")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterGenre, setFilterGenre] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    loadWatchlist()
  }, [])

  useEffect(() => {
    filterAndSortMovies()
  }, [movies, searchQuery, sortBy, sortOrder, filterGenre])

  const loadWatchlist = async () => {
    try {
      // In a real app, you'd have a dedicated watchlist endpoint
      const recommendations = await MovieService.getRecommendations()
      // Mock watchlist with some movies
      setMovies([...recommendations.forYou, ...recommendations.trending.slice(0, 2)])
    } catch (error) {
      console.error("Failed to load watchlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortMovies = () => {
    let filtered = [...movies]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Genre filter
    if (filterGenre !== "all") {
      const genreMap: { [key: string]: number } = {
        action: 28,
        adventure: 12,
        animation: 16,
        comedy: 35,
        crime: 80,
        drama: 18,
        fantasy: 14,
        horror: 27,
        romance: 10749,
        "sci-fi": 878,
        thriller: 53,
      }
      const genreId = genreMap[filterGenre]
      if (genreId) {
        filtered = filtered.filter((movie) => movie.genre_ids.includes(genreId))
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "rating":
          comparison = a.vote_average - b.vote_average
          break
        case "date_added":
          comparison = new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredMovies(filtered)
  }

  const handleRemoveFromWatchlist = async (movie: Movie) => {
    try {
      await MovieService.removeFromWatchlist(movie.id)
      setMovies((prev) => prev.filter((m) => m.id !== movie.id))
    } catch (error) {
      console.error("Failed to remove from watchlist:", error)
    }
  }

  const getUniqueGenres = () => {
    const genreIds = new Set(movies.flatMap((movie) => movie.genre_ids))
    const genreMap: { [key: number]: string } = {
      28: "action",
      12: "adventure",
      16: "animation",
      35: "comedy",
      80: "crime",
      18: "drama",
      14: "fantasy",
      27: "horror",
      10749: "romance",
      878: "sci-fi",
      53: "thriller",
    }
    return Array.from(genreIds)
      .map((id) => genreMap[id])
      .filter(Boolean)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Watchlist</h1>
          <p className="text-muted-foreground">
            {movies.length} movie{movies.length !== 1 ? "s" : ""} in your watchlist
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredMovies.length} showing
        </Badge>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your watchlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterGenre} onValueChange={setFilterGenre}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {getUniqueGenres().map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={(value) => {
            const [sort, order] = value.split("-")
            setSortBy(sort as typeof sortBy)
            setSortOrder(order as typeof sortOrder)
          }}
        >
          <SelectTrigger className="w-48">
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_added-desc">Recently Added</SelectItem>
            <SelectItem value="date_added-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="rating-asc">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Movies Grid/List */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {searchQuery || filterGenre !== "all" ? "No movies match your filters" : "Your watchlist is empty"}
          </p>
          {!searchQuery && filterGenre === "all" && (
            <p className="text-muted-foreground mt-2">Add movies to your watchlist to see them here</p>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-4"
          }
        >
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onMoviePlay}
              onAddToWatchlist={() => handleRemoveFromWatchlist(movie)}
              isInWatchlist={true}
              className={viewMode === "list" ? "flex flex-row max-w-none" : ""}
            />
          ))}
        </div>
      )}
    </div>
  )
}
