// src/components/ForecastStrip.jsx
import { motion } from "framer-motion";
import TempSparkline from "./TempSparkline";

function HourlyCard({ hour, icon, temp }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 dark:bg-black/20 backdrop-blur px-3 py-2 min-w-20">
      <p className="text-xs opacity-80">{hour}</p>
      <img
        className="w-10 h-10"
        src={`https://openweathermap.org/img/wn/${icon}.png`}
        alt=""
      />
      <p className="text-sm font-semibold">{Math.round(temp)}°</p>
    </div>
  );
}

function DayCard({ day, icon, min, max }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/15 dark:bg-black/20 backdrop-blur px-3 py-2">
      <div className="flex items-center gap-3">
        <img
          className="w-8 h-8"
          src={`https://openweathermap.org/img/wn/${icon}.png`}
          alt=""
        />
        <p className="text-sm font-medium">{day}</p>
      </div>
      <p className="text-sm">
        <span className="opacity-80">{Math.round(min)}°</span>
        <span className="mx-1 opacity-30">/</span>
        <span className="font-semibold">{Math.round(max)}°</span>
      </p>
    </div>
  );
}

export default function ForecastStrip({ hourly = [], daily = [], hourlyTemps = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="w-full max-w-2xl mt-6 space-y-6"
    >
      {/* Sparkline */}
      {hourlyTemps.length > 1 && (
        <div className="rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur p-4">
          <p className="text-sm mb-2 opacity-90">Next 24h temperature</p>
          <TempSparkline data={hourlyTemps} />
          <div className="mt-2 text-xs opacity-70 flex justify-between">
            <span>Now</span>
            <span>+24h</span>
          </div>
        </div>
      )}

      {/* Hourly */}
      {hourly.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Hourly</h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {hourly.map((h) => (
              <HourlyCard key={h.dt} hour={h.hour} icon={h.icon} temp={h.temp} />
            ))}
          </div>
        </div>
      )}

      {/* 5-Day */}
      {daily.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Next 5 Days</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {daily.map((d) => (
              <DayCard key={d.date} day={d.day} icon={d.icon} min={d.min} max={d.max} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
