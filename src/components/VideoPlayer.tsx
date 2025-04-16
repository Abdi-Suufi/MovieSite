import React, { useState, useEffect } from 'react'
import { FaTimes, FaExclamationTriangle, FaSync } from 'react-icons/fa'

interface VideoPlayerProps {
  type: 'movie' | 'tv'
  id: number
  season?: number
  episode?: number
  onClose: () => void
  title?: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  type, 
  id, 
  season, 
  episode, 
  onClose,
  title 
}) => {
  const [showWarning, setShowWarning] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playerSource, setPlayerSource] = useState<'vidsrc' | '2embed' | 'superembed'>('vidsrc')

  const getPlayerUrl = () => {
    if (playerSource === 'vidsrc') {
      if (type === 'movie') {
        return `https://vidsrc.xyz/embed/movie?tmdb=${id}`
      } else {
        if (season && episode) {
          return `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
        }
        return `https://vidsrc.xyz/embed/tv?tmdb=${id}`
      }
    } else if (playerSource === '2embed') {
      if (type === 'movie') {
        return `https://2embed.org/embed/movie?tmdb=${id}`
      } else {
        if (season && episode) {
          return `https://2embed.org/embed/tv?tmdb=${id}&s=${season}&e=${episode}`
        }
        return `https://2embed.org/embed/tv?tmdb=${id}`
      }
    } else {
      if (type === 'movie') {
        return `https://multiembed.mov/?video=tmdb:${id}`
      } else {
        if (season && episode) {
          return `https://multiembed.mov/?video=tmdb:${id}&s=${season}&e=${episode}`
        }
        return `https://multiembed.mov/?video=tmdb:${id}`
      }
    }
  }

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsPlaying(true)
    setError(null)
  }

  // Handle iframe error
  const handleIframeError = () => {
    console.error('Error loading video player')
    setError('Failed to load the video player. Please try a different source.')
  }

  // Switch to a different player source
  const switchPlayerSource = () => {
    if (playerSource === 'vidsrc') {
      setPlayerSource('2embed')
    } else if (playerSource === '2embed') {
      setPlayerSource('superembed')
    } else {
      setPlayerSource('vidsrc')
    }
    setError(null)
  }

  // Prevent navigation away from the site
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        const message = 'Are you sure you want to leave? The video will stop playing.'
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isPlaying])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header with title and close button */}
      <div className="bg-black/80 p-4 flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">{title || 'Now Playing'}</h2>
        <button 
          onClick={onClose}
          className="bg-netflix-red text-white p-2 rounded-full hover:bg-red-700 transition-colors"
          aria-label="Close player"
        >
          <FaTimes />
        </button>
      </div>
      
      {/* Warning message */}
      {showWarning && (
        <div className="bg-yellow-900/80 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-400 mr-2" />
            <p className="text-white">
              This is a third-party player. Use an ad blocker for the best experience.
            </p>
          </div>
          <button 
            onClick={() => setShowWarning(false)}
            className="text-white hover:text-yellow-400"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900/80 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-400 mr-2" />
            <p className="text-white">{error}</p>
          </div>
          <button 
            onClick={switchPlayerSource}
            className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors flex items-center"
          >
            <FaSync className="mr-2" />
            Try Different Source
          </button>
        </div>
      )}
      
      {/* Player source indicator */}
      <div className="bg-black/60 p-2 text-center text-white text-sm">
        Using: {playerSource === 'vidsrc' ? 'Vidsrc' : playerSource === '2embed' ? '2Embed' : 'SuperEmbed'}
      </div>
      
      {/* Video container */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                key={playerSource} // Force iframe to reload when source changes
                src={getPlayerUrl()}
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-2xl"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer 