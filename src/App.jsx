import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastStrip from './components/ForecastStrip'

const getBackgroundGradient = (type, darkMode) => {
  const light = {
    default: 'from-[#cce4f6] via-[#e8f4fd] to-[#f7fbff]',
    clear: 'from-[#dff3ff] via-[#fff3cf] to-[#fff7dd]',
    clouds: 'from-[#e9edf3] via-[#dde4ee] to-[#d8e1ee]',
    rain: 'from-[#d7e6f8] via-[#e6eff9] to-[#e9f0ff]',
    snow: 'from-[#f0f6fb] via-[#eef6ff] to-[#f7fbff]',
    fog: 'from-[#e5eaf0] via-[#edf0f5] to-[#f6f8fb]',
    thunder: 'from-[#e9e3ff] via-[#f1edff] to-[#f7fbff]',
    drizzle: 'from-[#e6f3ff] via-[#eef7fc] to-[#f5fbff]',
  }
  const dark = {
    default: 'from-[#0e1420] via-[#101826] to-[#131a29]',
    clear: 'from-[#1a202f] via-[#121822] to-[#0f141d]',
    clouds: 'from-[#1a1e29] via-[#12161f] to-[#0f141d]',
    rain: 'from-[#0f1a26] via-[#0b111a] to-[#0c121a]',
    snow: 'from-[#17202b] via-[#0e141c] to-[#0d141c]',
    fog: 'from-[#161b24] via-[#0e141c] to-[#0b0f15]',
    thunder: 'from-[#1a1626] via-[#0f0e16] to-[#0e1018]',
    drizzle: 'from-[#13202b] via-[#0d141c] to-[#0e141d]',
  }
  const k = (type || '').toLowerCase()
  const map = darkMode ? dark : light
  if (['mist', 'haze', 'fog'].includes(k)) return map.fog
  if (k === 'clear') return map.clear
  if (k === 'clouds') return map.clouds
  if (k === 'rain') return map.rain
  if (k === 'snow') return map.snow
  if (k === 'thunderstorm') return map.thunder
  if (k === 'drizzle') return map.drizzle
  return map.default
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [hourly, setHourly] = useState([])
  const [daily, setDaily] = useState([])
  const [hourlyTemps, setHourlyTemps] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved
      ? JSON.parse(saved)
      : window.matchMedia?.('(prefers-color-scheme: dark)').matches
  })

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    const html = document.documentElement
    darkMode ? html.classList.add('dark') : html.classList.remove('dark')
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toLocalDate = (unixSec, tz) => new Date((unixSec + tz) * 1000)
  const shortHour = (d) => new Intl.DateTimeFormat(undefined, { hour: 'numeric', hour12: true }).format(d)
  const weekday = (d) => new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(d)
  const isDayTime = (dateObj, sunrise, sunset) => dateObj >= sunrise && dateObj < sunset

  const mapCurrent = (data) => {
    const tzOffset = data.timezone ?? 0
    const sunrise = toLocalDate(data.sys.sunrise, tzOffset)
    const sunset = toLocalDate(data.sys.sunset, tzOffset)
    return {
      name: data.name,
      temp: Math.round(data.main.temp),
      feelsLike: data.main.feels_like,
      description: data.weather?.[0]?.description || '',
      type: data.weather?.[0]?.main || '',
      isDay: isDayTime(new Date(), sunrise, sunset),
      humidity: data.main.humidity,
      wind: data.wind.speed,
      tzOffset,
      coord: data.coord,
      sunrise,
      sunset,
    }
  }

  const buildDailyFrom3h = (forecastData, tzOffset, sunrise, sunset) => {
    const list = forecastData.list || []
    const byDay = {}
    list.forEach((it) => {
      const d = toLocalDate(it.dt, tzOffset)
      const key = d.toISOString().slice(0, 10)
      if (!byDay[key]) byDay[key] = []
      byDay[key].push(it)
    })

    const dayKeys = Object.keys(byDay).slice(0, 5)
    setDaily(
      dayKeys.map((k) => {
        const bucket = byDay[k]
        const temps = bucket.map((b) => b.main.temp)
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
          type: best.weather?.[0]?.main || 'Clear',
          isDay: isDayTime(dObj, sunrise, sunset),
        }
      })
    )
  }

  const build24hFrom3hForecast = (list, tzOffset, sunrise, sunset) => {
    const pts = list.slice(0, 9)
    if (pts.length < 2) return []
    const out = []
    for (let i = 0; i < 8; i++) {
      const a = pts[i], b = pts[i + 1] || pts[i]
      const tA = a.dt, tB = b.dt
      const tempA = a.main.temp, tempB = b.main.temp
      const type = a.weather?.[0]?.main || 'Clear'
      for (let j = 0; j < 3; j++) {
        const frac = j / 3
        const temp = tempA + (tempB - tempA) * frac
        const dt = tA + Math.round((tB - tA) * frac)
        const d = toLocalDate(dt, tzOffset)
        out.push({
          dt,
          hour: shortHour(d),
          temp,
          type,
          isDay: isDayTime(d, sunrise, sunset),
        })
      }
    }
    return out.slice(0, 24)
  }

  const fetchAll = async ({ q, lat, lon }) => {
    setLoading(true)
    setError('')
    setWeather(null)
    try {
      if (!apiKey) throw new Error('Missing OpenWeather API key')
      const params = q ? `q=${encodeURIComponent(q)}` : `lat=${lat}&lon=${lon}`
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?${params}&units=metric&appid=${apiKey}`
      const curRes = await fetch(currentUrl)
      if (!curRes.ok) throw new Error('Failed to fetch current weather')
      const cur = await curRes.json()
      const mapped = mapCurrent(cur)
      setWeather(mapped)

      const latUse = mapped.coord.lat ?? lat
      const lonUse = mapped.coord.lon ?? lon
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latUse}&lon=${lonUse}&units=metric&appid=${apiKey}`
      const fRes = await fetch(forecastUrl)
      if (!fRes.ok) throw new Error('Failed to fetch 5-day forecast')
      const fc = await fRes.json()
      const tz = fc.city?.timezone ?? mapped.tzOffset ?? 0
      buildDailyFrom3h(fc, tz, mapped.sunrise, mapped.sunset)
      const derived = build24hFrom3hForecast(fc.list || [], tz, mapped.sunrise, mapped.sunset)
      setHourly(derived)
      setHourlyTemps(derived.map((x) => x.temp))
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      if (navigator.geolocation) {
        try {
          const pos = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 12000,
              maximumAge: 300000,
            })
          )
          return fetchAll({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        } catch {}
      }
      try {
        const ipRes = await fetch('https://ipapi.co/json/')
        const ip = await ipRes.json()
        if (ip?.latitude && ip?.longitude) {
          await fetchAll({ lat: ip.latitude, lon: ip.longitude })
        }
      } catch {
        setError('Could not determine your location. Please search by city.')
      }
    })()
  }, [])

  const bgGradient = getBackgroundGradient(weather?.type, darkMode)

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} ${darkMode ? 'text-gray-100' : 'text-gray-900'} transition-all duration-700`}>
        <div className="w-full max-w-7xl mx-auto px-4 py-10">
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight drop-shadow-lg text-center"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: 'spring' }}>
            Weather<span className="text-sky-500">.</span>
          </motion.h1>
          <SearchBar city={city} setCity={setCity} handleSearch={() => city && fetchAll({ q: city })} darkMode={darkMode} setDarkMode={setDarkMode} />
          {loading && <p className="text-base opacity-80 mt-2 text-center">Loading...</p>}
          {error && <p className="text-rose-300 dark:text-rose-400 mt-2 text-sm text-center">{error}</p>}
          <AnimatePresence mode="wait">
            {weather && !loading && (
              <div className="mt-8 flex flex-col items-center gap-8">
                <WeatherCard weather={weather} />
                <div className="w-full max-w-4xl">
                  <ForecastStrip
                    hourly={hourly}
                    daily={daily}
                    hourlyTemps={hourlyTemps}
                    sunrise={weather.sunrise}
                    sunset={weather.sunset}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default App