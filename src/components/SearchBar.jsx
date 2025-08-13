// src/components/SearchBar.jsx
import { motion } from 'framer-motion'

function SearchBar({ city, setCity, handleSearch, darkMode, setDarkMode }) {
  const onSubmit = (e) => { e.preventDefault(); handleSearch() }

  return (
    <div className="w-full flex justify-center mb-6">
      <motion.form
        onSubmit={onSubmit}
        className="w-full max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
      >
        <div className="glass shadow-glow rounded-2xl flex items-center gap-2 p-2">
          <input
            type="text"
            placeholder="Search city (e.g., London)…"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 rounded-xl focus:outline-none focus:ring-2 ring-brand-300/60 dark:ring-brand-500/40 placeholder:opacity-70 text-[var(--text-main)]"
            aria-label="City name"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl font-semibold bg-brand-500 text-white hover:bg-brand-600 active:scale-[.98] transition shadow-card"
            aria-label="Search city"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-xl bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/15 transition"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}

export default SearchBar