import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaStar, FaCalendar, FaTv, FaPlay, FaPlus, FaInfoCircle, FaArrowLeft } from 'react-icons/fa'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import VideoPlayer from '../components/VideoPlayer'

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

interface Episode {
  id: number
  name: string
  overview: string
  still_path: string
  episode_number: number
  season_number: number
  air_date: string
  vote_average: number
}

interface Season {
  id: number
  name: string
  overview: string
  poster_path: string
  season_number: number
  episode_count: number
  air_date: string
}

const TVShowDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState<TVShowDetails | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      if (!id) {
        setError("No TV show ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const apiKey = import.meta.env.VITE_TMDB_API_KEY
        if (!apiKey) {
          setError("API key is missing. Please check your .env file.")
          setLoading(false)
          return
        }

        // Fetch TV show details
        const showUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
        const showResponse = await axios.get(showUrl)
        setShow(showResponse.data)

        // Fetch seasons
        const seasonsUrl = `https://api.themoviedb.org/3/tv/${id}/seasons?api_key=${apiKey}`
        const seasonsResponse = await axios.get(seasonsUrl)
        setSeasons(seasonsResponse.data.seasons)

        // Fetch episodes for the first season if available
        if (seasonsResponse.data.seasons.length > 0) {
          const firstSeason = seasonsResponse.data.seasons[0]
          const episodesUrl = `https://api.themoviedb.org/3/tv/${id}/season/${firstSeason.season_number}?api_key=${apiKey}`
          const episodesResponse = await axios.get(episodesUrl)
          setEpisodes(episodesResponse.data.episodes)
          setSelectedSeason(firstSeason.season_number)
        }
      } catch (error) {
        console.error('Error fetching TV show:', error)
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError("TV show not found")
          } else {
            setError(`Error: ${error.response?.status} - ${error.response?.statusText}`)
          }
        } else {
          setError("Failed to fetch TV show details")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTVShowDetails()
  }, [id])

  const handleSeasonChange = async (seasonNumber: number) => {
    if (!id) return
    
    setSelectedSeason(seasonNumber)
    try {
      const episodesRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
      )
      setEpisodes(episodesRes.data.episodes)
    } catch (error) {
      console.error('Error fetching episodes:', error)
      setError("Failed to fetch episodes")
    }
  }

  const handleEpisodeClick = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber)
    setShowPlayer(true)
  }

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
          onClick={() => navigate('/browse?type=tv')}
          className="netflix-button flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to TV Shows
        </button>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">TV Show not found</h1>
        <button 
          onClick={() => navigate('/browse?type=tv')}
          className="netflix-button flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to TV Shows
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {showPlayer ? (
        <VideoPlayer
          type="tv"
          id={Number(id)}
          season={selectedSeason}
          episode={selectedEpisode}
          onClose={() => setShowPlayer(false)}
          title={show ? `${show.name} - S${selectedSeason}E${selectedEpisode}` : undefined}
        />
      ) : (
        <>
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
                    <h1 className="text-4xl font-bold mb-2">{show.name}</h1>
                    
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
                          className="px-2 py-1 bg-white/20 rounded text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>

                    <p className="text-lg mb-6">{show.overview}</p>

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

          {/* Seasons and Episodes */}
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Seasons</h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => handleSeasonChange(season.season_number)}
                    className={`flex-shrink-0 w-48 ${
                      selectedSeason === season.season_number
                        ? 'ring-2 ring-netflix-red'
                        : ''
                    }`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${season.poster_path}`}
                      alt={season.name}
                      className="w-full rounded"
                    />
                    <div className="mt-2">
                      <h3 className="font-semibold">{season.name}</h3>
                      <p className="text-sm text-gray-400">
                        {season.episode_count} Episodes
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Episodes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer"
                    onClick={() => handleEpisodeClick(episode.episode_number)}
                  >
                    <div className="relative">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        className="w-full"
                      />
                      <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors">
                        <FaPlay className="text-white" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{episode.name}</h3>
                        <span className="text-sm text-gray-400">
                          E{episode.episode_number}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {episode.overview}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{episode.vote_average.toFixed(1)}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TVShowDetails 