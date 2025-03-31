import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'

const getBackgroundGradient = (type, darkMode) => {
  if (!type) return darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-400 to-blue-600'

  switch (type.toLowerCase()) {
    case 'clear':
      return darkMode ? 'from-yellow-500 to-gray-900' : 'from-blue-400 to-yellow-300'
    case 'clouds':
      return darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-400 to-gray-700'
    case 'rain':
      return darkMode ? 'from-blue-900 to-gray-900' : 'from-gray-600 to-blue-800'
    case 'snow':
      return darkMode ? 'from-blue-200 to-gray-800' : 'from-white to-blue-200'
    case 'thunderstorm':
      return darkMode ? 'from-purple-900 to-black' : 'from-purple-700 to-gray-900'
    case 'drizzle':
      return darkMode ? 'from-blue-700 to-gray-800' : 'from-blue-300 to-blue-500'
    case 'mist':
    case 'haze':
    case 'fog':
      return darkMode ? 'from-gray-700 to-gray-900' : 'from-gray-300 to-gray-500'
    default:
      return darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-400 to-blue-600'
  }
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    const html = document.documentElement
    darkMode ? html.classList.add('dark') : html.classList.remove('dark')
  }, [darkMode])

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )

      if (!res.ok) throw new Error('Failed to fetch location weather')

      const data = await res.json()

      const weatherData = {
        name: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        type: data.weather[0].main,
      }

      setWeather(weatherData)
    } catch (err) {
      setError('Unable to get weather from your location')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!city) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      )

      if (!res.ok) throw new Error('City not found')

      const data = await res.json()

      const weatherData = {
        name: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        type: data.weather[0].main,
      }

      setWeather(weatherData)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeatherByCoords(latitude, longitude)
      },
      () => {
        setError('Location access denied')
      }
    )
  }, [])

  const bgGradient = getBackgroundGradient(weather?.type, darkMode)

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b ${bgGradient} ${
        darkMode ? 'text-gray-100' : 'text-white'
      } px-4 transition-all duration-700`}
    >
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        Weather App
      </motion.h1>

      <SearchBar
        city={city}
        setCity={setCity}
        handleSearch={handleSearch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {loading && <p className="text-lg">Loading...</p>}
      {error && <p className="text-red-300 dark:text-red-400">{error}</p>}

      <AnimatePresence mode="wait">
        {weather && !loading && <WeatherCard weather={weather} />}
      </AnimatePresence>
    </div>
  )
}

export default App
