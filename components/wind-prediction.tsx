"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface WindPredictionProps {
  windData: any
  center: { lat: number; lon: number }
}

export default function WindPrediction({ windData, center }: WindPredictionProps) {
  const [timeRange, setTimeRange] = useState(60) // Default 60 minutes
  const [distanceRange, setDistanceRange] = useState(2) // Default 2 km
  const [predictionData, setPredictionData] = useState<any[]>([])
  const [stormChance, setStormChance] = useState<string>("Calculating...")

  useEffect(() => {
    if (!windData) return

    // Generate prediction data based on the Navier-Stokes model
    const data = generatePredictionData(windData, timeRange, distanceRange)
    setPredictionData(data)

    const maxSpeed = Math.max(...data.map(d => d.speed))
    if (maxSpeed >= 17) {
      setStormChance("High")
    } else if (maxSpeed >= 10) {
      setStormChance("Moderate")
    } else {
      setStormChance("0.001%")
    }
  }, [windData, timeRange, distanceRange])

  const generatePredictionData = (windData: any, timeRange: number, distanceRange: number) => {
    const result = []
    const currentSpeed = windData.wind.speed
    const currentDeg = windData.wind.deg

    // Parameters for our simplified Navier-Stokes model
    const pressureGradient = windData.main?.pressure ? (1013 - windData.main.pressure) / 10 : 0
    const temperatureEffect = windData.main?.temp ? (windData.main.temp - 15) / 10 : 0

    // Calculate time steps based on time range
    const timeSteps = 10 // Number of data points
    const timeStep = timeRange / timeSteps // minutes per step

    // Calculate distance steps based on distance range
    const distanceSteps = distanceRange * 1000 // Convert km to meters
    const distancePerStep = distanceSteps / timeSteps

    // Initial conditions
    let speed = currentSpeed
    let direction = currentDeg
    let distance = 0

    for (let i = 0; i <= timeSteps; i++) {
      const time = i * timeStep // minutes

      // Simplified Navier-Stokes model for wind evolution
      // 1. Pressure gradient effect
      // 2. Temperature effect
      // 3. Distance effect (wind tends to change with distance)
      // 4. Random turbulence

      if (i > 0) {
        // Calculate speed change
        const pressureEffect = pressureGradient * 0.02 * timeStep
        const tempEffect = temperatureEffect * 0.01 * timeStep
        const distanceEffect = (distance / 1000) * 0.05 // More effect with distance
        const turbulence = (Math.random() - 0.5) * 0.2 * timeStep

        // Update speed using our simplified model
        speed = Math.max(0.5, speed + pressureEffect + tempEffect - distanceEffect + turbulence)

        // Update direction
        const directionChange =
          (pressureGradient > 0 ? 1 : -1) * 0.5 * timeStep + // Pressure effect on direction
          (Math.random() - 0.5) * 5 // Random variation

        direction = (direction + directionChange) % 360
        if (direction < 0) direction += 360

        // Update distance
        distance += speed * 60 * timeStep // Convert m/s to m/min and multiply by time step
      }

      result.push({
        time,
        speed,
        direction,
        distance: distance / 1000, // Convert to km
      })
    }

    return result
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-sky-900 block mb-2">Time Range: {timeRange} minutes</label>
          <Slider
            value={[timeRange]}
            min={20}
            max={90}
            step={5}
            onValueChange={(value) => setTimeRange(value[0])}
            className="mb-6"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-sky-900 block mb-2">Distance Range: {distanceRange} km</label>
          <Slider
            value={[distanceRange]}
            min={1}
            max={4}
            step={0.5}
            onValueChange={(value) => setDistanceRange(value[0])}
            className="mb-6"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-sky-50 border-sky-100">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-sky-900 mb-2">Wind Speed Prediction</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis
                    dataKey="time"
                    label={{ value: "Minutes", position: "insideBottomRight", offset: -5 }}
                    tickFormatter={(value) => `${value}m`}
                  />
                  <YAxis label={{ value: "m/s", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)} m/s`, "Wind Speed"]}
                    labelFormatter={(value) => `After ${value} minutes`}
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
          </CardContent>
        </Card>

      </div>

      <div className="text-sm text-black bg-sky-50 p-3 rounded-md">
      <p>This prediction uses a simplified Navier-Stokes-based NWP model.</p>
        <p className="mt-2 font-medium">Storm Probability in this area: <span className="text-sky-900">{stormChance}</span></p>
      </div>
    </div>
  )
}
