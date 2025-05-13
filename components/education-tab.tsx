"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function EducationTab() {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sky-900">The Navier-Stokes Equation</AccordionTrigger>
          <AccordionContent className="text-black text-sm">
            <p>
              The Navier-Stokes equations are a set of partial differential equations that describe the motion of fluid
              substances. For wind prediction, we use a simplified 1D version that focuses on momentum conservation.
            </p>
            <div className="my-3 bg-sky-50 p-3 rounded-md overflow-x-auto">
              <p className="text-center">∂u/∂t + u∂u/∂x = -(1/ρ)∂p/∂x</p>
            </div>
            <p>Where:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>u is the wind velocity</li>
              <li>t is time</li>
              <li>x is position</li>
              <li>ρ is air density</li>
              <li>p is pressure</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sky-900">How Wind Prediction Works</AccordionTrigger>
          <AccordionContent className="text-black text-sm">
            <p>Wind prediction involves solving the Navier-Stokes equations numerically. In our simplified model:</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>We start with current wind measurements at various points</li>
              <li>We calculate pressure gradients based on weather data</li>
              <li>We solve the equations to predict how wind will evolve over time</li>
              <li>We update our predictions as new data becomes available</li>
            </ol>
            <p className="mt-2">More sophisticated models also account for:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Coriolis Effect:</strong> The Earth&apos;s rotation deflects moving air
              </li>
              <li>
                <strong>Terrain Effects:</strong> Mountains, valleys, and other landforms alter wind patterns
              </li>
              <li>
                <strong>Temperature Gradients:</strong> Differences in temperature create pressure differences
              </li>
              <li>
                <strong>Atmospheric Stability:</strong> How easily air can move vertically affects wind patterns
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-sky-900">Wind Vector Fields</AccordionTrigger>
          <AccordionContent className="text-black text-sm">
            <p>The arrows on the map represent a wind vector field. Each arrow shows:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Direction: where the wind is blowing toward</li>
              <li>Length: the wind speed (longer arrows = stronger wind)</li>
            </ul>
            <p className="mt-2">Vector fields help visualize how wind varies across space, showing patterns like:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <strong>Convergence:</strong> Where winds flow toward each other
              </li>
              <li>
                <strong>Divergence:</strong> Where winds flow away from each other
              </li>
              <li>
                <strong>Rotation:</strong> Circular wind patterns
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-sky-900">The Beaufort Scale</AccordionTrigger>
          <AccordionContent className="text-black text-sm">
            <p>
              The Beaufort scale is an empirical measure that relates wind speed to observed conditions. Developed in
              1805 by Sir Francis Beaufort, it helps describe wind intensity in standardized terms.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-sky-100">
                    <th className="border border-sky-200 p-1">Force</th>
                    <th className="border border-sky-200 p-1">Speed (m/s)</th>
                    <th className="border border-sky-200 p-1">Description</th>
                    <th className="border border-sky-200 p-1">Effects on Land</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-sky-200 p-1 text-center">0</td>
                    <td className="border border-sky-200 p-1">0-0.5</td>
                    <td className="border border-sky-200 p-1">Calm</td>
                    <td className="border border-sky-200 p-1">Smoke rises vertically</td>
                  </tr>
                  <tr>
                    <td className="border border-sky-200 p-1 text-center">3</td>
                    <td className="border border-sky-200 p-1">3.3-5.5</td>
                    <td className="border border-sky-200 p-1">Gentle breeze</td>
                    <td className="border border-sky-200 p-1">Leaves and small twigs in constant motion</td>
                  </tr>
                  <tr>
                    <td className="border border-sky-200 p-1 text-center">6</td>
                    <td className="border border-sky-200 p-1">10.7-13.8</td>
                    <td className="border border-sky-200 p-1">Strong breeze</td>
                    <td className="border border-sky-200 p-1">Large branches in motion</td>
                  </tr>
                  <tr>
                    <td className="border border-sky-200 p-1 text-center">9</td>
                    <td className="border border-sky-200 p-1">20.7-24.4</td>
                    <td className="border border-sky-200 p-1">Strong gale</td>
                    <td className="border border-sky-200 p-1">Structural damage occurs</td>
                  </tr>
                  <tr>
                    <td className="border border-sky-200 p-1 text-center">12</td>
                    <td className="border border-sky-200 p-1">≥ 32.6</td>
                    <td className="border border-sky-200 p-1">Hurricane force</td>
                    <td className="border border-sky-200 p-1">Widespread devastation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
