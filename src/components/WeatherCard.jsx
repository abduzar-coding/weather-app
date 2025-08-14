// src/components/WeatherCard.jsx
import { motion } from 'framer-motion'

function Stat({ label, value, emoji }) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-4 rounded-xl 
        bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-sm
        border border-white/50 dark:border-white/10
        transition-transform duration-300 hover:scale-[1.05] hover:shadow-md"
    >
      <span className="text-xl">{emoji}</span>
      <div className="text-sm leading-tight">
        <div className="font-semibold text-base">{value}</div>
        <div className="opacity-70">{label}</div>
      </div>
    </div>
  )
}

function WeatherCard({ weather }) {
  return (
    <motion.div
      key={`${weather?.name || ''}-${weather?.temp || ''}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 60, damping: 14 }}
      className="rounded-2xl p-8 md:p-12 text-center bg-gradient-to-br 
        from-white/80 to-white/40 dark:from-white/10 dark:to-white/[0.03]
        backdrop-blur-xl border border-white/40 dark:border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.08)] w-full max-w-3xl mx-auto space-y-8"
    >
      {/* City Name */}
      {weather?.name && (
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {weather.name}
        </h2>
      )}

      {/* Temperature */}
      {typeof weather?.temp === 'number' && (
        <div className="text-6xl md:text-7xl font-bold tracking-tight drop-shadow-sm">
          {weather.temp}°C
        </div>
      )}

      {/* Description */}
      {weather?.description && (
        <p className="capitalize opacity-80 text-lg md:text-xl mt-4">
          {weather.description}
        </p>
      )}

      {/* Stats */}
      <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8">
        {typeof weather?.humidity === 'number' && (
          <Stat label="Humidity" value={`${weather.humidity}%`} emoji="💧" />
        )}
        {typeof weather?.wind === 'number' && (
          <Stat label="Wind" value={`${Math.round(weather.wind)} km/h`} emoji="💨" />
        )}
        {typeof weather?.feelsLike === 'number' && (
          <Stat
            label="Feels like"
            value={`${Math.round(weather.feelsLike)}°C`}
            emoji="🌡️"
          />
        )}
      </div>
    </motion.div>
  )
}

export default WeatherCard
