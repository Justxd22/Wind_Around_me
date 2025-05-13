"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Wind, Compass, ArrowUp, Thermometer, Droplets } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WindChartProps {
  windData: any
}

export default function WindChart({ windData }: WindChartProps) {
  const [forecastData, setForecastData] = useState<any[]>([])

  useEffect(() => {
    if (!windData) return

    // Generate forecast data based on the Navier-Stokes inspired model
    const mockForecast = []
    const hours = 12
    const currentSpeed = windData.wind.speed
    const currentDeg = windData.wind.deg

    // Simple parameters for our model
    const pressureGradient = windData.main?.pressure ? (1013 - windData.main.pressure) / 10 : 0
    const temperatureEffect = windData.main?.temp ? (windData.main.temp - 15) / 10 : 0

    for (let i = 0; i < hours; i++) {
      // Time-dependent factors
      const timeHours = i

      // Simplified Navier-Stokes inspired model
      // 1. Pressure gradient effect (higher pressure -> stronger winds)
      // 2. Temperature effect (higher temp -> more turbulence)
      // 3. Diurnal variation (wind tends to be stronger during day)
      // 4. Some randomness for natural variation

      const diurnalEffect = Math.sin(((new Date().getHours() + timeHours) * Math.PI) / 12) * 0.5
      const randomVariation = (Math.random() - 0.5) * 0.8

      // Calculate speed change based on our simplified model
      const speedChange =
        pressureGradient * 0.2 + // Pressure effect
        temperatureEffect * 0.1 * timeHours + // Temperature builds up over time
        diurnalEffect + // Day/night cycle
        randomVariation // Random variations

      // Direction changes based on Coriolis-like effect and pressure
      const directionChange =
        timeHours * (pressureGradient > 0 ? 3 : -3) + // Pressure-based rotation
        Math.sin(timeHours / 2) * 10 // Oscillation

      mockForecast.push({
        time: i,
        speed: Math.max(0.5, currentSpeed + speedChange),
        direction: (currentDeg + directionChange) % 360,
      })
    }

    setForecastData(mockForecast)
  }, [windData])

  if (!windData) return null

  const windDirection = getWindDirection(windData.wind.deg)
  const beaufortScale = getBeaufortScale(windData.wind.speed)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-sky-50 border-sky-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-sky-600" />
              <span className="text-sky-900 font-medium">Wind Speed</span>
            </div>
            <div className="text-xl font-bold text-sky-900">
              {windData.wind.speed.toFixed(1)} <span className="text-sm font-normal">m/s</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-50 border-sky-100">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-sky-600" />
              <span className="text-sky-900 font-medium">Direction</span>
            </div>
            <div className="text-xl font-bold text-sky-900 flex items-center gap-1">
              <ArrowUp className="h-4 w-4" style={{ transform: `rotate(${windData.wind.deg}deg)` }} />
              <span>{windDirection}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional weather info if available */}
      {windData.main && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-sky-50 border-sky-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-sky-600" />
                <span className="text-sky-900 font-medium">Temperature</span>
              </div>
              <div className="text-xl font-bold text-sky-900">{windData.main.temp.toFixed(1)}°C</div>
            </CardContent>
          </Card>

          <Card className="bg-sky-50 border-sky-100">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-sky-600" />
                <span className="text-sky-900 font-medium">Humidity</span>
              </div>
              <div className="text-xl font-bold text-sky-900">{windData.main.humidity}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Beaufort scale info */}
      <Card className="bg-sky-50 border-sky-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-5 w-5 text-sky-600" />
            <span className="text-sky-900 font-medium">Beaufort Scale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-sky-900">{beaufortScale.force}</div>
            <div className="text-sm text-sky-700">{beaufortScale.description}</div>
          </div>
        </CardContent>
      </Card>

      <div className="h-[200px]">
        <h3 className="text-sm font-medium text-sky-900 mb-2">Wind Speed Forecast (12 hours)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis
              dataKey="time"
              label={{ value: "Hours", position: "insideBottomRight", offset: -5 }}
              tickFormatter={(value) => `${value}h`}
            />
            <YAxis label={{ value: "m/s", angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)} m/s`, "Wind Speed"]}
              labelFormatter={(value) => `In ${value} hours`}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#0284c7"
              strokeWidth={2}
              dot={{ fill: "#0284c7", r: 4 }}
              activeDot={{ r: 6, fill: "#0284c7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function getWindDirection(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

function getBeaufortScale(speed: number) {
  // Convert m/s to Beaufort scale
  if (speed < 0.5) return { force: 0, description: "Calm" }
  if (speed < 1.5) return { force: 1, description: "Light air" }
  if (speed < 3.3) return { force: 2, description: "Light breeze" }
  if (speed < 5.5) return { force: 3, description: "Gentle breeze" }
  if (speed < 7.9) return { force: 4, description: "Moderate breeze" }
  if (speed < 10.7) return { force: 5, description: "Fresh breeze" }
  if (speed < 13.8) return { force: 6, description: "Strong breeze" }
  if (speed < 17.1) return { force: 7, description: "High wind" }
  if (speed < 20.7) return { force: 8, description: "Gale" }
  if (speed < 24.4) return { force: 9, description: "Strong gale" }
  if (speed < 28.4) return { force: 10, description: "Storm" }
  if (speed < 32.6) return { force: 11, description: "Violent storm" }
  return { force: 12, description: "Hurricane force" }
}
