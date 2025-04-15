import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Browse from './pages/Browse'
import MovieDetails from './pages/MovieDetails'
import TVShowDetails from './pages/TVShowDetails'

function App() {
  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVShowDetails />} />
      </Routes>
    </div>
  )
}

export default App 