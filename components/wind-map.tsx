"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"
import L from "leaflet"

interface WindMapProps {
  windData: any
  center: { lat: number; lon: number }
}

export default function WindMap({ windData, center }: WindMapProps) {
  const map = useMap()

  useEffect(() => {
    if (!windData || !map) return

    // Clear previous wind arrows
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.icon instanceof L.DivIcon) {
        map.removeLayer(layer)
      }
    })

    // Create a grid of points around the center
    const gridSize = 5 // 5x5 grid
    const gridSpacing = 0.0005 // Reduced spacing for zoomed in view (roughly 50m at most latitudes)
    const baseSpeed = windData.wind.speed
    const baseDeg = windData.wind.deg

    // Generate grid points with wind data
    const gridPoints = []

    // Create a more realistic wind field with some patterns
    for (let i = -Math.floor(gridSize / 2); i <= Math.floor(gridSize / 2); i++) {
      for (let j = -Math.floor(gridSize / 2); j <= Math.floor(gridSize / 2); j++) {
        const lat = center.lat + i * gridSpacing
        const lon = center.lon + j * gridSpacing

        // Distance from center affects wind speed (simulating terrain effects)
        const distanceFromCenter = Math.sqrt(i * i + j * j)
        const terrainFactor = 1 - (distanceFromCenter / gridSize) * 0.3

        // Add some natural variation and patterns
        // This creates a more realistic wind field with some coherence
        const xInfluence = Math.sin(i * 0.7) * 0.8
        const yInfluence = Math.cos(j * 0.7) * 0.8

        // Calculate variations
        const speedVariation = terrainFactor * (1 + xInfluence * 0.2)
        const degVariation = baseDeg + yInfluence * 15 + xInfluence * 10

        gridPoints.push({
          lat,
          lon,
          wind: {
            speed: baseSpeed * speedVariation,
            deg: degVariation % 360,
          },
        })
      }
    }

    // Add wind arrows to the map
    gridPoints.forEach((point) => {
      const { lat, lon, wind } = point

      // Scale arrow size based on wind speed - MUCH larger now
      const arrowLength = Math.min(wind.speed * 20, 100) // Increased from 12 to 20, max from 60 to 100
      const arrowWidth = 8 // Increased from 4px to 8px

      // Create arrow icon with improved styling and visibility
      const arrowIcon = L.divIcon({
        html: `<div style="
          transform: rotate(${wind.deg}deg);
          width: ${arrowLength}px;
          height: ${arrowWidth}px;
          background-color: rgba(2, 132, 199, 1); /* Solid color for maximum visibility */
          position: relative;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.5); /* Increased shadow */
        ">
          <div style="
            position: absolute;
            right: 0;
            top: -8px; /* Adjusted for wider arrow */
            border-left: 16px solid rgba(2, 132, 199, 1); /* Increased from 10px to 16px */
            border-top: 12px solid transparent; /* Increased from 7px to 12px */
            border-bottom: 12px solid transparent; /* Increased from 7px to 12px */
          "></div>
        </div>`,
        className: "wind-arrow",
        iconSize: [100, 24], // Increased from [60, 14] to [100, 24]
        iconAnchor: [0, 0],
      })

      // Add marker with arrow icon
      const marker = L.marker([lat, lon], { icon: arrowIcon }).addTo(map)

      // Add tooltip showing wind speed and direction
      marker.bindTooltip(`${wind.speed.toFixed(1)} m/s, ${getWindDirection(wind.deg)}`, {
        direction: "top",
        offset: L.point(0, -5),
      })
    })

    return () => {
      // Cleanup on unmount
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.options.icon instanceof L.DivIcon) {
          map.removeLayer(layer)
        }
      })
    }
  }, [windData, center, map])

  return null
}

// Helper function to get wind direction name
function getWindDirection(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}
