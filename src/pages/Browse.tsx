import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

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
  const type = searchParams.get('type') || 'movie'
  const [trending, setTrending] = useState<Movie[] | TVShow[]>([])
  const [popular, setPopular] = useState<Movie[] | TVShow[]>([])
  const [topRated, setTopRated] = useState<Movie[] | TVShow[]>([])

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/trending/${type}/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/${type}/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
        ])

        setTrending(trendingRes.data.results)
        setPopular(popularRes.data.results)
        setTopRated(topRatedRes.data.results)
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }

    fetchContent()
  }, [type])

  const renderContentRow = (items: Movie[] | TVShow[], title: string) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
      <Slider {...sliderSettings}>
        {items.map((item) => (
          <div key={item.id} className="px-2">
            <div className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={'title' in item ? item.title : item.name}
                className="w-full rounded"
              />
              <div className="movie-info">
                <h3 className="text-sm font-semibold">
                  {'title' in item ? item.title : item.name}
                </h3>
                <div className="flex items-center text-sm">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{item.vote_average.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )

  return (
    <div className="pt-20">
      {renderContentRow(trending, 'Trending Now')}
      {renderContentRow(popular, 'Popular')}
      {renderContentRow(topRated, 'Top Rated')}
    </div>
  )
}

export default Browse 