import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Movie {
  id: number
  title: string
  backdrop_path: string
  overview: string
}

const Home = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        )
        const movies = response.data.results
        setFeaturedMovie(movies[0])
      } catch (error) {
        console.error('Error fetching featured movie:', error)
      }
    }

    fetchFeaturedMovie()
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        {featuredMovie && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/50 to-transparent" />
            </div>
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                  {featuredMovie.title}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mb-8">
                  {featuredMovie.overview}
                </p>
                <div className="flex space-x-4">
                  <Link
                    to={`/movie/${featuredMovie.id}`}
                    className="netflix-button"
                  >
                    More Info
                  </Link>
                  <Link
                    to="/browse"
                    className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors"
                  >
                    Browse Movies
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home 