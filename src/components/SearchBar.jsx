// src/components/SearchBar.jsx
import { motion } from 'framer-motion'

function SearchBar({ city, setCity, handleSearch, darkMode, setDarkMode }) {
  const onSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      className="flex gap-2 mb-6 w-full max-w-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
    >
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg text-black focus:outline-none"
        aria-label="City name"
      />

      <button
        type="submit"
        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
        aria-label="Search city"
      >
        Search
      </button>

      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded-lg shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </motion.form>
  )
}

export default SearchBar
