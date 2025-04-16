import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Movie {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
}

interface TVShow {
  id: number
  name: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
}

const Browse = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const type = searchParams.get('type') || 'movie'
  const [trending, setTrending] = useState<Movie[] | TVShow[]>([])
  const [popular, setPopular] = useState<Movie[] | TVShow[]>([])
  const [topRated, setTopRated] = useState<Movie[] | TVShow[]>([])
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  }

  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/70`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <FaChevronRight className="text-white text-xl" />
      </div>
    );
  }

  function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-2 cursor-pointer hover:bg-black/70`}
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <FaChevronLeft className="text-white text-xl" />
      </div>
    );
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const apiKey = import.meta.env.VITE_TMDB_API_KEY
        if (!apiKey) {
          throw new Error("API key is missing")
        }

        // Fetch trending content
        const trendingUrl = `https://api.themoviedb.org/3/trending/${type}/week?api_key=${apiKey}`
        console.log('Fetching trending content from:', trendingUrl)
        const trendingRes = await axios.get(trendingUrl)
        console.log('Trending response:', trendingRes.data)
        setTrending(trendingRes.data.results)

        // Fetch popular content
        const popularUrl = `https://api.themoviedb.org/3/${type}/popular?api_key=${apiKey}`
        console.log('Fetching popular content from:', popularUrl)
        const popularRes = await axios.get(popularUrl)
        console.log('Popular response:', popularRes.data)
        setPopular(popularRes.data.results)

        // Fetch top rated content
        const topRatedUrl = `https://api.themoviedb.org/3/${type}/top_rated?api_key=${apiKey}`
        console.log('Fetching top rated content from:', topRatedUrl)
        const topRatedRes = await axios.get(topRatedUrl)
        console.log('Top rated response:', topRatedRes.data)
        setTopRated(topRatedRes.data.results)

        // Log the first item from each category to verify IDs
        if (trendingRes.data.results.length > 0) {
          console.log('Sample trending item:', {
            id: trendingRes.data.results[0].id,
            title: trendingRes.data.results[0].title || trendingRes.data.results[0].name,
            type: type
          })
        }
        if (popularRes.data.results.length > 0) {
          console.log('Sample popular item:', {
            id: popularRes.data.results[0].id,
            title: popularRes.data.results[0].title || popularRes.data.results[0].name,
            type: type
          })
        }
        if (topRatedRes.data.results.length > 0) {
          console.log('Sample top rated item:', {
            id: topRatedRes.data.results[0].id,
            title: topRatedRes.data.results[0].title || topRatedRes.data.results[0].name,
            type: type
          })
        }
      } catch (error) {
        console.error('Error fetching content:', error)
        if (axios.isAxiosError(error)) {
          setError(`Error: ${error.response?.status} - ${error.response?.statusText}`)
        } else {
          setError("Failed to fetch content")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [type])

  const handleItemClick = (item: Movie | TVShow) => {
    const itemType = 'title' in item ? 'movie' : 'tv'
    navigate(`/${itemType}/${item.id}`)
  }

  const renderContentRow = (items: Movie[] | TVShow[], title: string) => (
    <div className="mb-8 relative group">
      <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
      <div className="relative">
        <Slider {...sliderSettings}>
          {items.map((item) => (
            <div 
              key={item.id} 
              className="px-2 cursor-pointer"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={'title' in item ? item.title : item.name}
                  className="w-full rounded"
                />
                <div className={`movie-info ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-sm font-semibold">
                    {'title' in item ? item.title : item.name}
                  </h3>
                  <div className="flex items-center text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{item.vote_average.toFixed(1)}</span>
                  </div>
                  <p className="text-xs mt-2 line-clamp-2">{item.overview}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="text-2xl mb-4">Error loading content</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {trending.length > 0 && renderContentRow(trending, 'Trending Now')}
      {popular.length > 0 && renderContentRow(popular, 'Popular')}
      {topRated.length > 0 && renderContentRow(topRated, 'Top Rated')}
      
      {trending.length === 0 && popular.length === 0 && topRated.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl mb-4">No content found</h2>
          <p className="mb-4">We couldn't find any {type === 'movie' ? 'movies' : 'TV shows'} to display.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go to Home
          </button>
        </div>
      )}
    </div>
  )
}

export default Browse 