import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'


import { Star, TrendingUp, Clock } from 'lucide-react'
// Import your contexts
import { AuthProvider } from './contexts/auth-context'
import { NotificationProvider } from './contexts/notification-context'

// Import only the components actually used in the JSX
import { MovieCard } from './components/movies/movie-card'
import { MovieCarousel } from './components/movies/movie-carousel'
import { MovieDetailsModal } from './components/movies/movie-details-modal'

// Import only the UI components actually used
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu'
import { Input } from './components/ui/input'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from './components/ui/navigation-menu'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from './components/ui/pagination'
import { Progress } from './components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Separator } from './components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Toaster } from './components/ui/toaster'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip'
import { Accordion } from './components/ui/accordion'
import { Alert } from './components/ui/alert'
import { AlertDialog } from './components/ui/alert-dialog'

// Import only the analytics components actually used
import { ActivityChart } from './components/analytics/activity-chart'
import { GenreChart } from './components/analytics/genre-chart'
import { RatingDistributionChart } from './components/analytics/rating-distribution'
import { StatsCard } from './components/analytics/stats-card'
import { RecentActivityList } from './components/analytics/recent-activity'

// Import your app pages (only those actually used in routes)
import DashboardPage from './app/dashboard/page'
import AnalyticsPage from './app/analytics/page'
import LoginPage from './app/login/login'
import RegisterPage from './app/register/page'
import SettingsPage from './app/settings/page'
import LandingPage from './app/watchlist/page'
import LoadingPage from './app/dashboard/page'

// Your main movie recommendation homepage
function HomePage() {
  const [showMovieDetails, setShowMovieDetails] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with navigation and search */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                CinemaHub
              </h1>
              <Badge variant="secondary">Beta</Badge>
            </div>
            
            {/* Enhanced navigation menu */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Button variant="ghost">Home</Button>
                  </NavigationMenuTrigger>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost">Movies</Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost">TV Shows</Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost">Watchlist</Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search and user section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-gray-700 border-gray-600"
                />
              </div>
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section with tabs */}
        <section className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Your Intelligent Movie Companion
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Discover amazing movies with AI-powered recommendations
          </p>
          
          {/* Category tabs */}
          <Tabs defaultValue="recommendations" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto">
              <TabsTrigger value="recommendations">For You</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
              <TabsTrigger value="top">Top Rated</TabsTrigger>
            </TabsList>
            <TabsContent value="recommendations">
              <p className="text-gray-400">Personalized recommendations based on your preferences</p>
            </TabsContent>
            <TabsContent value="trending">
              <p className="text-gray-400">What's popular right now</p>
            </TabsContent>
            <TabsContent value="new">
              <p className="text-gray-400">Latest movie releases</p>
            </TabsContent>
            <TabsContent value="top">
              <p className="text-gray-400">Highest rated movies</p>
            </TabsContent>
          </Tabs>

          {/* Stats cards with progress indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <StatsCard 
                  title="Movies Watched"
                  value="127"
                  icon={Star}
                  subtitle="This month"
                  trend={{ value: 12, isPositive: true }}
                />
                <Progress value={75} className="mt-4" />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <StatsCard 
                  title="Hours Streamed"
                  value="48.5"
                  icon={Clock}
                  subtitle="hours"
                  trend={{ value: 8, isPositive: true }}
                />
                <Progress value={60} className="mt-4" />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <StatsCard 
                  title="Recommendations Accuracy"
                  value="94%"
                  icon={TrendingUp}
                  subtitle="accuracy rate"
                  trend={{ value: 5, isPositive: true }}
                />
                <Progress value={90} className="mt-4" />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Movie carousel with enhanced controls */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Recommended for You</h3>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Filter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter movies by genre, year, or rating</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </div>
          <MovieCarousel 
            title="Recommended Movies"
            movies={[]} // You'll need actual movie data here
            onMoviePlay={(movie) => console.log('Play movie:', movie)}
            onAddToWatchlist={(movie) => console.log('Add to watchlist:', movie)}
            onRate={(movie, rating) => console.log('Rate movie:', movie, rating)}
          />
        </section>

        {/* Analytics dashboard */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Your Movie Analytics</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Genre Distribution</CardTitle>
                <CardDescription className="text-gray-400">Your favorite movie genres</CardDescription>
              </CardHeader>
              <CardContent>
                  <GenreChart data={[
                      { genre: 'Action', count: 25, percentage: 35, averageRating: 4.2 },
                      { genre: 'Comedy', count: 18, percentage: 25, averageRating: 3.8 },
                      { genre: 'Drama', count: 15, percentage: 21, averageRating: 4.5 }
                    ]} />
                </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Viewing Activity</CardTitle>
                <CardDescription className="text-gray-400">Your watching patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityChart data={[
                  { month: 'Jan', moviesWatched: 12, hoursWatched: 24 },
                  { month: 'Feb', moviesWatched: 15, hoursWatched: 30 },
                  { month: 'Mar', moviesWatched: 18, hoursWatched: 36 }
                ]} />
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Rating Distribution</CardTitle>
                <CardDescription className="text-gray-400">How you rate movies</CardDescription>
              </CardHeader>
              <CardContent>
                <RatingDistributionChart data={[
                  { rating: 5, count: 15 },
                  { rating: 4, count: 25 },
                  { rating: 3, count: 12 }
                ]} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Movie grid with enhanced layout */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Trending Movies</h3>
            <div className="flex space-x-2">
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="comedy">Comedy</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                  <SelectItem value="horror">Horror</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                Grid View
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} onClick={() => setShowMovieDetails(true)} className="cursor-pointer">
                
                <MovieCard movie={{
                  id: 1,
                  title: 'Sample Movie',
                  overview: 'A great movie...',
                  poster_path: '/sample-poster.jpg',
                  vote_average: 8.5,
                  genre_ids: [28, 12],
                  release_date: '2024-01-01'
                }} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>

        {/* Recent activity with collapsible sections */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <Accordion type="single" collapsible className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <Alert className="mb-4">
                  <AlertDialog />
                  <div>
                    <h4 className="font-medium">New Recommendations Available</h4>
                    <p className="text-sm text-gray-400">
                      You have 3 new movie recommendations based on your recent activity
                    </p>
                  </div>
                </Alert>
                <Separator className="my-4" />
                <RecentActivityList activities={[
                  { id: '1', action: 'watched', movieTitle: 'Sample Movie', timestamp: '2024-01-01T12:00:00Z' },
                  { id: '2', action: 'rated', movieTitle: 'Another Movie', rating: 4, timestamp: '2024-01-01T10:00:00Z' }
                ]} />
              </CardContent>
            </Card>
          </Accordion>
        </section>

        {/* Newsletter signup */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700">
            <CardContent className="p-8">
              <CardTitle className="text-2xl font-bold mb-4 text-white">Stay Updated</CardTitle>
              <CardDescription className="text-gray-300 mb-6">
                Get the latest movie recommendations delivered to your inbox
              </CardDescription>
              <div className="flex space-x-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Movie details modal with enhanced dialog */}
      {showMovieDetails && (
        <Dialog open={showMovieDetails} onOpenChange={setShowMovieDetails}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Movie Details</DialogTitle>
            </DialogHeader>
            <MovieDetailsModal onClose={() => setShowMovieDetails(false)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App