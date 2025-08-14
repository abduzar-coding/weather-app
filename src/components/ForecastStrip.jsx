// src/components/ForecastStrip.jsx
import { motion } from 'framer-motion'

export default function ForecastStrip({ hourly = [], daily = [] }) {
  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Hourly Forecast */}
      <div className="w-full max-w-4xl rounded-2xl p-7 bg-white/60 dark:bg-white/5 
        backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md space-y-4">
        <h3 className="text-xl font-semibold mb-2">Hourly</h3>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/20">
          {hourly.map((h, idx) => (
            <motion.div
              key={h.dt || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.02 }}
              className="min-w-[110px] text-center rounded-xl bg-white/70 dark:bg-white/10 
                border border-white/50 dark:border-white/10 px-4 py-5 shadow-sm backdrop-blur
                transition-transform duration-300 hover:scale-[1.06] space-y-2"
            >
              <div className="text-sm opacity-75">{h?.hour || '--'}</div>
              {/* Removed icons */}
              <div className="font-semibold text-lg tabular-nums">
                {Math.round(h?.temp ?? 0)}°
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="w-full max-w-4xl rounded-2xl p-7 bg-white/60 dark:bg-white/5 
        backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md space-y-4">
        <h3 className="text-xl font-semibold mb-2">Next 5 Days</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {daily.map((d, idx) => (
            <motion.div
              key={d.date || idx}
              whileHover={{ scale: 1.03 }}
              className="flex items-center justify-between rounded-xl px-5 py-4 
                bg-white/70 dark:bg-white/10 border border-white/50 dark:border-white/10 
                backdrop-blur-md shadow-sm transition-transform duration-300"
            >
              <div className="flex items-center gap-4">
                <span className="w-2.5 h-2.5 bg-brand-500 rounded-full 
                  shadow-[0_0_0_3px_rgba(31,176,255,0.15)]" />
                <span className="font-medium text-lg">{d?.day || '--'}</span>
              </div>
              <span className="tabular-nums text-base opacity-90">
                {Math.round(d?.min ?? 0)}° / <b>{Math.round(d?.max ?? 0)}°</b>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}