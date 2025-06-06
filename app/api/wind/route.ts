import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    // Use the API key from environment variables
    const API_KEY = process.env.OPENWEATHER_API_KEY

    if (!API_KEY) {
      throw new Error("OpenWeatherMap API key is not configured")
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching wind data:", error)
    return NextResponse.json({ error: "Failed to fetch wind data" }, { status: 500 })
  }
}
