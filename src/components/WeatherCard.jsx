import { motion } from 'framer-motion'

function WeatherCard({ weather }) {
  return (
    <motion.div
      key={weather.name + weather.temp}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 60, damping: 12 }}
      className="bg-white bg-opacity-20 dark:bg-opacity-10 dark:bg-black backdrop-blur-md p-6 rounded-xl shadow-md text-center w-full max-w-md"
    >
      <h2 className="text-2xl font-semibold">{weather.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.description}
        className="mx-auto"
      />
      <p className="text-xl font-bold">{weather.temp}°C</p>
      <p className="capitalize">{weather.description}</p>
      <div className="flex justify-between mt-4 text-sm">
        <p>💧 Humidity: {weather.humidity}%</p>
        <p>💨 Wind: {weather.wind} km/h</p>
      </div>
    </motion.div>
  )
}

export default WeatherCard
