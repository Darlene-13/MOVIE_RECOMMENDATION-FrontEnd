"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Star, TrendingUp, Users, Bell, BarChart3 } from "lucide-react"
import {Link} from 'react-router-dom'

const featuredMovies = [
  {
    id: 1,
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    rating: 8.9,
    image: "/dune-movie-poster-desert-sci-fi.png",
    backdrop: "/dune-desert-landscape-cinematic.png",
  },
  {
    id: 2,
    title: "Oppenheimer",
    genre: "Biography",
    rating: 8.7,
    image: "/oppenheimer-movie-poster-atomic-bomb.png",
    backdrop: "/atomic-explosion-dramatic-lighting.png",
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation",
    rating: 9.1,
    image: "/spider-man-animated-multiverse-colorful.png",
    backdrop: "/spider-verse-multiverse-colorful-abstract.png",
  },
]

const features = [
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Smart Recommendations",
    description: "AI-powered suggestions based on your viewing history and preferences",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Analytics Dashboard",
    description: "Track your viewing habits and discover new genres you might love",
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: "Real-time Notifications",
    description: "Get notified about new releases, trending movies, and personalized updates",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Social Features",
    description: "Share recommendations with friends and see what's popular in your network",
  },
]

export default function LandingPage() {
  const [currentMovie, setCurrentMovie] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const movie = featuredMovies[currentMovie]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Dynamic Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${movie.backdrop})`,
          }}
        />

        {/* Content */}
        <div
          className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            CineAI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover your next favorite movie with AI-powered recommendations tailored just for you
          </p>

          {/* Featured Movie Card */}
          <Card className="bg-card/90 backdrop-blur-sm border-border/50 max-w-md mx-auto mb-8 transition-all duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <img
                  src={movie.image || "/placeholder.svg"}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                <div className="text-left">
                  <h3 className="text-card-foreground font-semibold text-lg">{movie.title}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {movie.genre}
                  </Badge>
                  <div className="flex items-center gap-1 text-card-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{movie.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Movie Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMovie(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentMovie ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Why Choose CineAI?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of movie discovery with our intelligent recommendation system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Discover Amazing Movies?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of movie lovers who trust CineAI for their entertainment needs
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">CineAI</h3>
          <p className="text-muted-foreground">Your intelligent movie companion. Discover, track, and enjoy.</p>
        </div>
      </footer>
    </div>
  )
}
