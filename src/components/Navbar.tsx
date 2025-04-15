import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaBell, FaUser } from 'react-icons/fa'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-netflix-black' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-netflix-red text-2xl font-bold">
            NETFLIX
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/browse" className="text-white hover:text-netflix-gray">Home</Link>
            <Link to="/browse?type=tv" className="text-white hover:text-netflix-gray">TV Shows</Link>
            <Link to="/browse?type=movie" className="text-white hover:text-netflix-gray">Movies</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-netflix-gray">
            <FaSearch className="text-xl" />
          </button>
          <button className="text-white hover:text-netflix-gray">
            <FaBell className="text-xl" />
          </button>
          <button className="text-white hover:text-netflix-gray">
            <FaUser className="text-xl" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 