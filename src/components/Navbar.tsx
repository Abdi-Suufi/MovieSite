import { Link } from 'react-router-dom'
import Search from './Search'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-netflix-red text-2xl font-bold">
            MovieSite
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-netflix-gray">
              Home
            </Link>
            <Link to="/browse" className="text-white hover:text-netflix-gray">
              Browse
            </Link>
            <Search />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 