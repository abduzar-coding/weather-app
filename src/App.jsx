// src/App.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastStrip from './components/ForecastStrip'

const getBackgroundGradient = (type, darkMode) => {
  if (!type) return darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-400 to-blue-600'
  switch ((type || '').toLowerCase()) {
    case 'clear': return darkMode ? 'from-yellow-500 to-gray-900' : 'from-blue-400 to-yellow-300'
    case 'clouds': return darkMode ? 'from-gray-800 to-gray-900' : 'from-gray-400 to-gray-700'
    case 'rain': return darkMode ? 'from-blue-900 to-gray-900' : 'from-gray-600 to-blue-800'
    case 'snow': return darkMode ? 'from-blue-200 to-gray-800' : 'from-white to-blue-200'
    case 'thunderstorm': return darkMode ? 'from-purple-900 to-black' : 'from-purple-700 to-gray-900'
    case 'drizzle': return darkMode ? 'from-blue-700 to-gray-800' : 'from-blue-300 to-blue-500'
    case 'mist':
    case 'haze':
    case 'fog': return darkMode ? 'from-gray-700 to-gray-900' : 'from-gray-300 to-gray-500'
    default: return darkMode ? 'from-gray-900 to-gray-800' : 'from-blue-400 to-blue-600'
  }
}

// time helpers
const toLocalDate = (unixSec, tzOffsetSec) => new Date((unixSec + tzOffsetSec) * 1000)
const shortHour = (d) => new Intl.DateTimeFormat(undefined, { hour: '2-digit' }).format(d)
const weekday = (d) => new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(d)

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [hourly, setHourly] = useState([])          // 24 hourly items
  const [daily, setDaily] = useState([])            // next 5 days (grouped)
  const [hourlyTemps, setHourlyTemps] = useState([]) // sparkline
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    const html = document.documentElement
    darkMode ? html.classList.add('dark') : html.classList.remove('dark')
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // normalize current weather
  const mapCurrent = (data) => ({
    name: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: data.main.feels_like,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    type: data.weather[0].main,
    tzOffset: data.timezone ?? 0,
    coord: data.coord, // { lat, lon }
  })

  // Build 5‑day view from 3‑hour forecast
  const buildDailyFrom3h = (forecastData, tzOffset) => {
    const list = forecastData.list || []
    const byDay = {}
    list.forEach((it) => {
      const d = toLocalDate(it.dt, tzOffset)
      const key = d.toISOString().slice(0, 10)
      if (!byDay[key]) byDay[key] = []
      byDay[key].push(it)
    })

    const dayKeys = Object.keys(byDay).slice(0, 5)
    const dailyArr = dayKeys.map((k) => {
      const bucket = byDay[k]
      const temps = bucket.map((b) => b.main.temp)
      // pick icon near 12:00
      let best = bucket[0], bestDiff = 24
      bucket.forEach((b) => {
        const h = toLocalDate(b.dt, tzOffset).getHours()
        const diff = Math.abs(h - 12)
        if (diff < bestDiff) { best = b; bestDiff = diff }
      })
      const dObj = toLocalDate(bucket[0].dt, tzOffset)
      return {
        date: k,
        day: weekday(dObj),
        min: Math.min(...temps),
        max: Math.max(...temps),
        icon: best.weather?.[0]?.icon || '01d',
      }
    })
    setDaily(dailyArr)
  }

  // Fetch true hourly (1‑hour steps) via One Call 3.0
  const fetchHourlyOneCall = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch hourly forecast')
    const data = await res.json()
    const tzOffset = data.timezone_offset ?? 0
    const h24 = (data.hourly || []).slice(0, 24).map((h) => {
      const d = toLocalDate(h.dt, tzOffset)
      return {
        dt: h.dt,
        hour: shortHour(d),
        temp: h.temp,
        icon: (h.weather?.[0]?.icon || '01d') + '.png',
      }
    })
    setHourly(h24)
    setHourlyTemps(h24.map((x) => x.temp))
  }

  const fetchAll = async ({ q, lat, lon }) => {
    if (!apiKey) throw new Error('Missing OpenWeather API key (VITE_OPENWEATHER_API_KEY)')

    // 1) current
    const params = q ? `q=${encodeURIComponent(q)}` : `lat=${lat}&lon=${lon}`
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?${params}&units=metric&appid=${apiKey}`
    const curRes = await fetch(currentUrl)
    if (!curRes.ok) throw new Error('Failed to fetch current weather')
    const cur = await curRes.json()
    const mapped = mapCurrent(cur)
    setWeather(mapped)
    if (mapped?.name) document.title = `${mapped.name} Weather | Abduzar-weather`

    // we need lat/lon for hourly onecall (works for both city + coords flows)
    const latUse = mapped?.coord?.lat ?? lat
    const lonUse = mapped?.coord?.lon ?? lon

    // 2) hourly 1‑hour steps (24)
    await fetchHourlyOneCall(latUse, lonUse)

    // 3) daily (5‑day) using 3‑hour forecast endpoint
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latUse}&lon=${lonUse}&units=metric&appid=${apiKey}`
    const fRes = await fetch(forecastUrl)
    if (!fRes.ok) throw new Error('Failed to fetch 5‑day forecast')
    const fc = await fRes.json()
    const tz = fc.city?.timezone ?? mapped.tzOffset ?? 0
    buildDailyFrom3h(fc, tz)
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    setError('')
    setWeather(null)
    try {
      await fetchAll({ lat, lon })
    } catch (err) {
      setError(err.message || 'Unable to get weather from your location')
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
      await fetchAll({ q: city })
    } catch (err) {
      setError(err.message || 'City not found')
    } finally {
      setLoading(false)
    }
  }

  // Auto geolocation on mount (original behavior), with better options & messages
  useEffect(() => {
    if (!navigator.geolocation) return
    const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        fetchWeatherByCoords(latitude, longitude)
      },
      (err) => {
        const code = err?.code
        const reason =
          code === 1 ? 'Location permission denied'
          : code === 2 ? 'Location unavailable'
          : code === 3 ? 'Location request timed out'
          : 'Could not get your location'
        setError(`${reason}. You can also search by city.`)
      },
      opts
    )
  }, []) // run once

  const bgGradient = getBackgroundGradient(weather?.type, darkMode)

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start sm:justify-center bg-gradient-to-b ${bgGradient} ${
        darkMode ? 'text-gray-100' : 'text-white'
      } px-4 py-8 transition-all duration-700`}
    >
      <motion.h1
        className="text-4xl font-bold mb-6 mt-4"
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
        {weather && !loading && (
          <>
            <WeatherCard weather={weather} />
            <ForecastStrip hourly={hourly} daily={daily} hourlyTemps={hourlyTemps} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App