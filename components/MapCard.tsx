"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import WindMap from "./wind-map"

export default function MapCard({ location, windData }: {
  location: { lat: number, lon: number },
  windData: any
}) {
  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl">
      <CardHeader className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <CardTitle className="text-sky-100 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-300" />
          Wind Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[500px] relative rounded-b-2xl overflow-hidden">
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>'
            url="https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png"
          />
          {windData && <WindMap windData={windData} center={location} />}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
