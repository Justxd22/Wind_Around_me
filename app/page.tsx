"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet"
import WindMap from "@/components/wind-map"
import WindChart from "@/components/wind-chart"
import WindPrediction from "@/components/wind-prediction"
import EducationTab from "@/components/education-tab"
import LocationPermission from "@/components/location-permission"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, MapPin, Info, BarChart, Clock } from "lucide-react"
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
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-900 flex items-center gap-2">
            <Wind className="h-8 w-8 text-sky-600" />
            Wind Around Me
          </h1>
          <p className="text-sky-700 mt-2">Real-time wind visualization and prediction</p>
        </header>

        {error ? (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : loading ? (
          <Card>
            <CardContent className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md border-sky-100">
                <CardHeader className="bg-sky-50 border-b border-sky-100">
                  <CardTitle className="text-sky-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-sky-600" />
                    Wind Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {windData && <WindPrediction windData={windData} center={location} />}
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-sky-100">
                <CardHeader className="bg-sky-50 border-b border-sky-100">
                  <CardTitle className="text-sky-900 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-sky-600" />
                    Wind Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">{windData && <WindChart windData={windData} />}</CardContent>
              </Card>

            </div>

            {location && <MapCard location={location} windData={windData} />}


            <Card className="shadow-md border-sky-100">
              <CardHeader className="bg-sky-50 border-b border-sky-100">
                <CardTitle className="text-sky-900 flex items-center gap-2">
                  <Info className="h-5 w-5 text-sky-600" />
                  Learn More
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="model" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="model">Wind Model</TabsTrigger>
                    <TabsTrigger value="equations">Equations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="model" className="p-4">
                    <EducationTab />
                  </TabsContent>
                  <TabsContent value="equations" className="p-4">
                    <div className="space-y-4">
                      <h3 className="font-medium text-sky-900">1D Navier-Stokes Equation</h3>
                      <div className="bg-sky-50 p-3 rounded-md overflow-x-auto">
                        <p className="text-center">∂u/∂t + u∂u/∂x = -(1/ρ)∂p/∂x</p>
                      </div>
                      <p className="text-sm text-sky-700">
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
