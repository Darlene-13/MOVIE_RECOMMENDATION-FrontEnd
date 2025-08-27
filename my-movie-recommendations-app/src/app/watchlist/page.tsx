"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { WatchlistPage } from "@/components/movies/watchlist-page"
import { MovieDetailsModal } from "@/components/movies/movie-details-modal"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {Link} from "react-router-dom"
import type { Movie } from "@/lib/movies"

export default function WatchlistPageRoute() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMoviePlay = (movie: Movie) => {
    console.log("Playing movie:", movie.title)
    // Implement movie player logic
  }

  const handleMovieDetails = (movieId: number) => {
    setSelectedMovieId(movieId)
    setIsModalOpen(true)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <WatchlistPage onMoviePlay={handleMoviePlay} onMovieDetails={handleMovieDetails} />
        </main>

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
