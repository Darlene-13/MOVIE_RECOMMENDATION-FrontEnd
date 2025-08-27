"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { MovieService, type Movie } from "@/lib/movies"

interface EnhancedSearchProps {
  onSearch: (query: string) => void
  onMovieSelect?: (movie: Movie) => void
  placeholder?: string
  className?: string
}

export function EnhancedSearch({
  onSearch,
  onMovieSelect,
  placeholder = "Search movies...",
  className = "",
}: EnhancedSearchProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("cineai_recent_searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions()
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      const results = await MovieService.searchMovies(query)
      setSuggestions(results.slice(0, 5))
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // Add to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem("cineai_recent_searches", JSON.stringify(newRecentSearches))

    onSearch(searchQuery)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query)
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
    setSuggestions([])
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("cineai_recent_searches")
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <Card
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden shadow-lg"
        >
          <CardContent className="p-0">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-b border-border">
                <div className="px-4 py-2 text-sm font-medium text-muted-foreground">Suggestions</div>
                {suggestions.map((movie) => (
                  <button
                    key={movie.id}
                    onClick={() => {
                      onMovieSelect?.(movie)
                      setQuery(movie.title)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent text-left transition-colors"
                  >
                    <img
                      src={movie.poster_path || "/placeholder.svg?height=60&width=40&query=movie poster"}
                      alt={movie.title}
                      className="w-8 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{movie.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !query && (
              <div>
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent text-left transition-colors"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {!query && (
              <div className="border-t border-border">
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </div>
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {["Dune", "Marvel", "Batman", "Sci-Fi", "Action"].map((trend) => (
                      <Badge
                        key={trend}
                        variant="secondary"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setQuery(trend)
                          handleSearch(trend)
                        }}
                      >
                        {trend}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
