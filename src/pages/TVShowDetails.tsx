import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { FaStar, FaCalendar, FaTv } from 'react-icons/fa'

interface TVShowDetails {
  id: number
  name: string
  overview: string
  backdrop_path: string
  poster_path: string
  vote_average: number
  first_air_date: string
  number_of_seasons: number
  genres: { id: number; name: string }[]
}

const TVShowDetails = () => {
  const { id } = useParams()
  const [show, setShow] = useState<TVShowDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        )
        setShow(response.data)
      } catch (error) {
        console.error('Error fetching TV show details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTVShowDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">TV Show not found</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
        </div>

        {/* Show Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="w-64 flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{show.name}</h1>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center">
                    <FaTv className="mr-2" />
                    <span>{show.number_of_seasons} Seasons</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {show.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <p className="text-lg">{show.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TVShowDetails 