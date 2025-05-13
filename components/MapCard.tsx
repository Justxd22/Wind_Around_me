"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Wind } from "lucide-react"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import WindMap from "./wind-map"

export default function MapCard({ location, windData }: {
  location: { lat: number, lon: number },
  windData: any
}) {
  return (
    <Card className="backdrop-blur-md bg-white/30 border border-white/50 shadow-lg overflow-hidden">
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
