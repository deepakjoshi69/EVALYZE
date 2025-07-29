"use client"

import { motion } from "framer-motion"

export default function LoadingAnimation() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff003c]/5 via-transparent to-[#a100ff]/5" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 text-center">
        {/* Spinning Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-8"
        >
          <div className="w-full h-full border-4 border-gray-700 border-t-[#ff003c] rounded-full" />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="text-2xl font-bold text-white font-mono mb-4"
        >
          Generating Problems with Gemini...
        </motion.h2>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
              className="w-3 h-3 bg-[#ff003c] rounded-full"
            />
          ))}
        </div>

        {/* Status Text */}
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="text-gray-400 mt-6 font-mono text-sm"
        >
          {">"} Analyzing topic requirements...
          <br />
          {">"} Generating diverse problem sets...
          <br />
          {">"} Optimizing difficulty levels...
        </motion.p>
      </div>
    </div>
  )
}
