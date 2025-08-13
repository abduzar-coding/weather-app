// src/components/ForecastStrip.jsx
import { motion } from 'framer-motion'

export default function ForecastStrip({ hourly = [], daily = [], hourlyTemps = [] }) {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Hourly Forecast */}
      <div className="w-full max-w-4xl rounded-2xl p-5 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md">
        <h3 className="text-lg font-semibold mb-3">Hourly</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
          {hourly.map((h, idx) => (
            <motion.div
              key={h.dt || idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.02 }}
              className="min-w-[100px] text-center rounded-xl bg-white/60 dark:bg-white/10 
                border border-white/50 dark:border-white/10 px-3 py-4 shadow-sm backdrop-blur"
            >
              <div className="text-xs opacity-75 mb-1">{h.hour}</div>
              <img
                src={h.icon}
                alt=""
                width={44}
                height={44}
                className="mx-auto select-none"
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://openweathermap.org/img/wn/01d@2x.png' }}
              />
              <div className="mt-1 font-semibold tabular-nums">{Math.round(h.temp)}°</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="w-full max-w-4xl rounded-2xl p-5 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md">
        <h3 className="text-lg font-semibold mb-3">Next 5 Days</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {daily.map((d, idx) => (
            <div
              key={d.date || idx}
              className="flex items-center justify-between rounded-xl px-4 py-3 
                bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/10 
                backdrop-blur-md shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-brand-500 rounded-full shadow-[0_0_0_3px_rgba(31,176,255,0.15)]" />
                <span className="font-medium">{d.day}</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={`https://openweathermap.org/img/wn/${d.icon}@2x.png`}
                  alt=""
                  width={36}
                  height={36}
                  loading="lazy"
                />
                <span className="tabular-nums text-sm opacity-90">
                  {Math.round(d.min)}° / <b>{Math.round(d.max)}°</b>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}