import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa'

interface SearchResult {
  id: number
  title?: string
  name?: string
  poster_path: string
  media_type: 'movie' | 'tv'
  release_date?: string
  first_air_date?: string
}

const Search = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus input when search is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch()
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const performSearch = async () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const apiKey = import.meta.env.VITE_TMDB_API_KEY
      if (!apiKey) {
        throw new Error("API key is missing")
      }

      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`
      )
      
      // Filter out results without posters and only include movies and TV shows
      const filteredResults = response.data.results.filter((result: SearchResult) => 
        result.media_type === 'movie' || result.media_type === 'tv'
      )
      
      setResults(filteredResults)
    } catch (error) {
      console.error('Error searching:', error)
      setError('Failed to search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false)
    setQuery('')
    navigate(`/${result.media_type}/${result.id}`)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).getFullYear()
  }

  return (
    <div ref={searchRef} className="relative">
      {/* Search button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-white hover:text-netflix-gray"
        aria-label="Search"
      >
        <FaSearch className="text-xl" />
      </button>

      {/* Search overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/90">
          <div className="container mx-auto px-4 py-6">
            {/* Search header */}
            <div className="flex items-center mb-6">
              <div className="relative flex-1 max-w-3xl mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies and TV shows..."
                  className="w-full bg-white/10 text-white px-4 py-3 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="ml-4 text-white hover:text-netflix-gray"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Search results */}
            <div className="max-w-3xl mx-auto">
              {loading ? (
                <div className="flex justify-center py-20">
                  <FaSpinner className="text-netflix-red text-3xl animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-20 text-red-500">{error}</div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.map((result) => (
                    <div 
                      key={`${result.media_type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      {result.poster_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                          alt={result.title || result.name}
                          className="w-12 h-18 object-cover rounded mr-4"
                        />
                      ) : (
                        <div className="w-12 h-18 bg-gray-700 rounded mr-4 flex items-center justify-center">
                          <FaTimes className="text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{result.title || result.name}</h3>
                        <div className="text-sm text-gray-400">
                          <span className="capitalize">{result.media_type}</span>
                          {formatDate(result.release_date || result.first_air_date) && (
                            <span> • {formatDate(result.release_date || result.first_air_date)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="text-center py-20 text-gray-400">
                  No results found for "{query}"
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search 