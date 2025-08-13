import { motion } from 'framer-motion'

function Stat({ label, value, emoji }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl 
      bg-white/60 dark:bg-white/5 
      backdrop-blur-md shadow-sm
      border border-white/50 dark:border-white/10
      transition-all duration-300 hover:scale-[1.03] hover:shadow-md"
    >
      <span className="text-lg">{emoji}</span>
      <div className="text-sm leading-tight">
        <div className="font-semibold">{value}</div>
        <div className="opacity-70">{label}</div>
      </div>
    </div>
  )
}

function WeatherCard({ weather }) {
  return (
    <motion.div
      key={weather.name + weather.temp}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 60, damping: 14 }}
      className="rounded-2xl p-6 md:p-10 text-center
        bg-gradient-to-br from-white/80 to-white/40 dark:from-white/10 dark:to-white/[0.03]
        backdrop-blur-xl border border-white/40 dark:border-white/10
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all duration-500 w-full max-w-3xl mx-auto space-y-4"
    >
      <h2 className="text-2xl md:text-3xl font-semibold">{weather.name}</h2>

      <div className="text-5xl md:text-6xl font-bold tracking-tight drop-shadow-sm">
        {weather.temp}°C
      </div>

      <p className="capitalize opacity-80 text-base md:text-lg">{weather.description}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6">
        <Stat label="Humidity" value={`${weather.humidity}%`} emoji="💧" />
        <Stat label="Wind" value={`${Math.round(weather.wind)} km/h`} emoji="💨" />
        {typeof weather.feelsLike === 'number' && (
          <Stat label="Feels like" value={`${Math.round(weather.feelsLike)}°C`} emoji="🌡️" />
        )}
      </div>
    </motion.div>
  )
}

export default WeatherCard