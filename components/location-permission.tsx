"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface LocationPermissionProps {
  setLocation: (location: { lat: number; lon: number }) => void
}

export default function LocationPermission({ setLocation }: LocationPermissionProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGetLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        let errorMessage = "Failed to get your location"

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "You denied the request for location access. Please enable location services for this site in your browser settings."
            break
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please try again later."
            break
          case err.TIMEOUT:
            errorMessage = "The request to get your location timed out. Please try again."
            break
        }

        setError(errorMessage)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: "url('/above-clouds.jpg')" }}>
      <Card className="max-w-md w-full shadow-lg border-sky-100">
        <CardHeader className="bg-sky-50 border-b border-sky-100">
          <CardTitle className="text-sky-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-sky-600" />
            Location Access
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <p className="text-sky-700">
            Needs your location to show wind data in your area. Your location is only used to fetch local
            wind information and is never stored.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGetLocation} className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
            {loading ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Getting Location...
              </>
            ) : (
              "Share My Location"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
