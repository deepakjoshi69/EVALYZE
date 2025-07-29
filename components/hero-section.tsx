"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import Link from "next/link" // Correctly imported Link

// Dynamically import the SplineModel to prevent server-side rendering issues
const SplineModel = dynamic(() => import("./spline-model"), { ssr: false });

export default function HeroSection() {
  return (
    // Added `relative` and `overflow-hidden` to contain the 3D model
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Full-screen 3D Model Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <SplineModel />
        </Suspense>
      </div>
      
      {/* Optional: Add a semi-transparent overlay to make text more readable */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      {/* Centered Content */}
      <div className="relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md-text-7xl font-bold text-white mb-10">
            Level Up Your
            <br />
            <span className="bg-gradient-to-r from-[#ff003c] to-[#a100ff] bg-clip-text text-transparent">
              IT Career
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Practice coding, test your skills, and prepare for interviews in one place.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Correctly wrapped the Button with the Link component */}
            <Link href="/practice">
              <Button className="px-8 py-4 text-lg bg-gradient-to-r from-[#ff003c] to-[#a100ff] hover:scale-105 transition-transform">
                Practice
              </Button>
            </Link>
            <Link href="/test">
              <Button className="px-8 py-4 text-lg border-2 border-[#ff003c] bg-transparent text-white hover:bg-[#ff003c] hover:scale-105 transition-all">
                Test
              </Button>
            </Link>
            <Link href="/prep">
              <Button className="px-8 py-4 text-lg border-2 border-[#a100ff] bg-transparent text-white hover:bg-[#a100ff] hover:scale-105 transition-all">
                Prep
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
