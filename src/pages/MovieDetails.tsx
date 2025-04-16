import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaStar, FaCalendar, FaClock, FaPlay, FaPlus, FaInfoCircle, FaShare, FaArrowLeft } from 'react-icons/fa'
import VideoPlayer from '../components/VideoPlayer'

interface MovieDetails {
  id: number
  title: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  release_date: string
  runtime: number
  genres: { id: number; name: string }[]
  tagline: string
  status: string
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string }[]
}

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        )
        setMovie(response.data)
      } catch (error) {
        console.error('Error fetching movie details:', error)
        setError('An error occurred while fetching movie details.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Error</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/browse?type=movie')}
          className="netflix-button flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Movies
        </button>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Movie not found</h1>
        <button 
          onClick={() => navigate('/browse?type=movie')}
          className="netflix-button flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Movies
        </button>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen">
      {showPlayer ? (
        <VideoPlayer
          type="movie"
          id={Number(id)}
          onClose={() => setShowPlayer(false)}
          title={movie?.title}
        />
      ) : (
        <div className="relative h-[70vh]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-64 flex-shrink-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                  {movie.tagline && (
                    <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendar className="mr-2" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-2" />
                      <span>{movie.runtime} min</span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-white/20 rounded text-sm">
                        {movie.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-lg mb-6">{movie.overview}</p>

                  <div className="flex gap-4">
                    <button 
                      className="netflix-button flex items-center"
                      onClick={() => setShowPlayer(true)}
                    >
                      <FaPlay className="mr-2" />
                      Play
                    </button>
                    <button className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors flex items-center">
                      <FaPlus className="mr-2" />
                      My List
                    </button>
                    <button className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors flex items-center">
                      <FaInfoCircle className="mr-2" />
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails 