"use client"

import { useState, useEffect } from "react"
import WindChart from "@/components/wind-chart"
import WindPrediction from "@/components/wind-prediction"
import EducationTab from "@/components/education-tab"
import LocationPermission from "@/components/location-permission"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Info, BarChart, Clock } from "lucide-react"
import "leaflet/dist/leaflet.css"
import dynamic from "next/dynamic"

const MapCard = dynamic(() => import("@/components/MapCard"), { ssr: false })

export default function Home() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [windData, setWindData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (location) {
      fetchWindData(location.lat, location.lon)
    }
  }, [location])

  const fetchWindData = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      setError(null)
      // In a real app, you would call your API route that securely uses your API key
      const response = await fetch(`/api/wind?lat=${lat}&lon=${lon}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch wind data: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setWindData(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching wind data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch wind data. Please try again later.")
      setLoading(false)
    }
  }

  if (!location) {
    return <LocationPermission setLocation={setLocation} />
  }

  return (
    <main
      className="min-h-screen p-4 md:p-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/above-clouds.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 backdrop-blur-sm bg-white/40 p-4 rounded-lg border border-white/50 shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold text-black flex items-center gap-2 text-shadow-sm">
            <Wind className="h-8 w-8 text-sky-600" />
            Navier-Stokes Wind Prediction
          </h1>
          <p className="text-sky-800 mt-2 font-medium text-shadow-sm">Real-time wind visualization and prediction</p>
        </header>

        {error ? (
          <Card className="bg-red-50/80 backdrop-blur-md border border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card className="backdrop-blur-md bg-white/40 border border-white/50">
            <CardContent className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <Card className="backdrop-blur-md bg-white/40 border border-white/50 shadow-lg">
                <CardHeader className="border-b border-white/20">
                  <CardTitle className="text-sky-900 flex items-center gap-2 text-shadow-sm">
                    <Clock className="h-5 w-5 text-sky-600" />
                    Wind Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {windData && <WindPrediction windData={windData} center={location} />}
                </CardContent>
              </Card>

              <Card className="backdrop-blur-md bg-white/40 border border-white/50 shadow-lg">
                <CardHeader className="border-b border-white/20">
                  <CardTitle className="text-sky-900 flex items-center gap-2 text-shadow-sm">
                    <BarChart className="h-5 w-5 text-sky-600" />
                    Wind Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">{windData && <WindChart windData={windData} />}</CardContent>
              </Card>
            </div>

            {location && (
              <Card className="backdrop-blur-md bg-white/40 border border-white/50 shadow-lg overflow-hidden">
                <CardHeader className="border-b border-white/20">
                  <CardTitle className="text-sky-900 flex items-center gap-2 text-shadow-sm">
                    <Wind className="h-5 w-5 text-sky-600" />
                    Wind Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <MapCard location={location} windData={windData} />
                </CardContent>
              </Card>
            )}

            <Card className="backdrop-blur-md bg-white/40 border border-white/50 shadow-lg">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="text-sky-900 flex items-center gap-2 text-shadow-sm">
                  <Info className="h-5 w-5 text-sky-600" />
                  Learn More
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="model" className="w-full">
                  <TabsList className="w-full grid grid-cols-2 bg-white/20">
                    <TabsTrigger value="model" className="data-[state=active]:bg-white/30">
                      Wind Model
                    </TabsTrigger>
                    <TabsTrigger value="equations" className="data-[state=active]:bg-white/30">
                      Equations
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="model" className="p-4">
                    <EducationTab />
                  </TabsContent>
                  <TabsContent value="equations" className="p-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-sky-900">1D Navier-Stokes Equation</h3>
                      <div className="bg-sky-50/70 backdrop-blur-sm p-3 rounded-md overflow-x-auto">
                        <p className="text-center">∂u/∂t + u∂u/∂x = -(1/ρ)∂p/∂x</p>
                      </div>
                      <p className="text-sm text-sky-800 font-medium">
                        This simplified equation describes how wind velocity changes over time, ignoring viscosity and
                        external forces.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
