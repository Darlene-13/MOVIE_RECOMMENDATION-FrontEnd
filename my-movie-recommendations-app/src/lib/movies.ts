// Movie API service and types
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  genres?: Genre[]
  runtime?: number
  director?: string
  cast?: string[]
}

export interface Genre {
  id: number
  name: string
}

export interface MovieRecommendations {
  trending: Movie[]
  forYou: Movie[]
  byGenre: { [key: string]: Movie[] }
  newReleases: Movie[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export class MovieService {
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

  static async getRecommendations(): Promise<MovieRecommendations> {
    try {
      return await this.fetchWithAuth("/movies/recommendations")
    } catch (error) {
      // Fallback to mock data if API fails
      return this.getMockRecommendations()
    }
  }

  static async searchMovies(query: string): Promise<Movie[]> {
    try {
      return await this.fetchWithAuth(`/movies/search?q=${encodeURIComponent(query)}`)
    } catch (error) {
      return this.getMockSearchResults(query)
    }
  }

  static async getMovieDetails(id: number): Promise<Movie> {
    try {
      return await this.fetchWithAuth(`/movies/${id}`)
    } catch (error) {
      return this.getMockMovieDetails(id)
    }
  }

  static async rateMovie(movieId: number, rating: number): Promise<void> {
    await this.fetchWithAuth(`/movies/${movieId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    })
  }

  static async addToWatchlist(movieId: number): Promise<void> {
    await this.fetchWithAuth(`/movies/${movieId}/watchlist`, {
      method: "POST",
    })
  }

  static async removeFromWatchlist(movieId: number): Promise<void> {
    await this.fetchWithAuth(`/movies/${movieId}/watchlist`, {
      method: "DELETE",
    })
  }

  // Mock data for development/fallback
  private static getMockRecommendations(): MovieRecommendations {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: "Dune: Part Two",
        overview:
          "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
        poster_path: "/dune-movie-poster-desert-sci-fi.png",
        backdrop_path: "/dune-desert-landscape-cinematic.png",
        release_date: "2024-03-01",
        vote_average: 8.9,
        genre_ids: [878, 12],
        runtime: 166,
        director: "Denis Villeneuve",
      },
      {
        id: 2,
        title: "Oppenheimer",
        overview:
          "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
        poster_path: "/oppenheimer-movie-poster-atomic-bomb.png",
        backdrop_path: "/atomic-explosion-dramatic-lighting.png",
        release_date: "2023-07-21",
        vote_average: 8.7,
        genre_ids: [36, 18],
        runtime: 180,
        director: "Christopher Nolan",
      },
      {
        id: 3,
        title: "Spider-Man: Across the Spider-Verse",
        overview:
          "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.",
        poster_path: "/spider-man-animated-multiverse-colorful.png",
        backdrop_path: "/spider-verse-multiverse-colorful-abstract.png",
        release_date: "2023-06-02",
        vote_average: 9.1,
        genre_ids: [16, 28, 12],
        runtime: 140,
        director: "Joaquim Dos Santos",
      },
      {
        id: 4,
        title: "The Batman",
        overview:
          "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        poster_path: "/batman-dark-knight-movie-poster.png",
        backdrop_path: "/gotham-city-dark-batman-cityscape.png",
        release_date: "2022-03-04",
        vote_average: 8.2,
        genre_ids: [28, 80, 18],
        runtime: 176,
        director: "Matt Reeves",
      },
      {
        id: 5,
        title: "Everything Everywhere All at Once",
        overview:
          "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led.",
        poster_path: "/everything-everywhere-all-at-once-multiverse-poste.png",
        backdrop_path: "/multiverse-chaos-colorful-abstract.png",
        release_date: "2022-03-25",
        vote_average: 8.8,
        genre_ids: [28, 12, 35],
        runtime: 139,
        director: "Daniels",
      },
    ]

    return {
      trending: mockMovies.slice(0, 3),
      forYou: [mockMovies[3], mockMovies[4], mockMovies[0]],
      byGenre: {
        Action: [mockMovies[3], mockMovies[4]],
        "Sci-Fi": [mockMovies[0], mockMovies[2]],
        Drama: [mockMovies[1], mockMovies[4]],
      },
      newReleases: [mockMovies[0], mockMovies[1]],
    }
  }

  private static getMockSearchResults(query: string): Movie[] {
    const allMovies = this.getMockRecommendations()
    const combined = [...allMovies.trending, ...allMovies.forYou]
    return combined.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()))
  }

  private static getMockMovieDetails(id: number): Movie {
    const allMovies = this.getMockRecommendations()
    const combined = [...allMovies.trending, ...allMovies.forYou]
    return combined.find((movie) => movie.id === id) || combined[0]
  }
}
