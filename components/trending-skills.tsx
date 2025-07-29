"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

// Curated list of the most important technologies
const skills = [
  { name: "React", icon: "⚛️", description: "Build modern, high-performance user interfaces with the most popular front-end library.", color: "#61DAFB" },
  { name: "AI/ML", icon: "🤖", description: "Master the fundamentals of artificial intelligence and machine learning to build intelligent applications.", color: "#FF6B6B" },
  { name: "Cloud (AWS/Azure)", icon: "☁️", description: "Deploy, scale, and manage applications efficiently using leading cloud platforms like AWS and Azure.", color: "#4ECDC4" },
  { name: "Python", icon: "🐍", description: "Learn the world's most versatile programming language, essential for web development, data science, and more.", color: "#FFE66D" },
  { name: "DevOps", icon: "🔧", description: "Automate and streamline your development workflows to build and deploy software faster and more reliably.", color: "#A8E6CF" },
  { name: "Cybersecurity", icon: "🔒", description: "Learn to protect systems, networks, and data from digital attacks and security breaches.", color: "#F06292" },
  { name: "Node.js", icon: "🟢", description: "Build scalable and efficient server-side applications using JavaScript with the Node.js runtime.", color: "#68A063" },
  { name: "Docker", icon: "🐳", description: "Containerize your applications with Docker to ensure consistency across all development and production environments.", color: "#0db7ed" },
]

export default function TrendingSkills() {
  const [selectedSkill, setSelectedSkill] = useState<(typeof skills)[0] | null>(null)
  
  // Ref to measure the width of the marquee for a seamless loop
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [marqueeWidth, setMarqueeWidth] = useState(0);

  useEffect(() => {
    if (marqueeRef.current) {
      // The total width is the scrollable width, we need half for the loop
      setMarqueeWidth(marqueeRef.current.scrollWidth / 2);
    }
  }, [skills]);


  return (
    <section className="bg-black/50 border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white text-center mb-16 font-mono"
        >
          Trending <span className="text-[#a100ff]">Skills</span>
        </motion.h2>

        {/* Floating Cards Container - Adjusted height for one row */}
        <div className="relative h-64 overflow-hidden">
          {/* Single Row - Left to Right */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full">
            <motion.div
              ref={marqueeRef}
              animate={{ x: [0, -marqueeWidth] }} // Animate from start to the halfway point
              transition={{
                duration: 40, // Adjusted duration for a smooth scroll
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
              className="flex space-x-8"
            >
              {/* Map all skills */}
              {skills.map((skill, index) => (
                <SkillCard key={`row1-${skill.name}-${index}`} skill={skill} onClick={() => setSelectedSkill(skill)} />
              ))}
              {/* Duplicate all skills for seamless loop */}
              {skills.map((skill, index) => (
                <SkillCard
                  key={`row1-dup-${skill.name}-${index}`}
                  skill={skill}
                  onClick={() => setSelectedSkill(skill)}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Modal */}
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#ff003c]/50 rounded-lg p-8 max-w-md w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              }}
            >
              {/* Animated Background */}
              <motion.div
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(255, 0, 60, 0.1), transparent)",
                    "linear-gradient(45deg, transparent, rgba(161, 0, 255, 0.1))",
                    "linear-gradient(45deg, rgba(255, 0, 60, 0.1), transparent)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="absolute inset-0"
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className="text-5xl p-3 rounded-lg border border-[#ff003c]/30"
                      style={{ backgroundColor: `${selectedSkill.color}20` }}
                    >
                      {selectedSkill.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-mono">{selectedSkill.name}</h3>
                      <div className="text-[#ff003c] text-sm font-mono">SKILL MODULE</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">{selectedSkill.description}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-4 bg-gradient-to-r from-[#ff003c] to-[#a100ff] text-white font-bold rounded-lg font-mono tracking-wider relative overflow-hidden"
                  style={{
                    clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
                  }}
                >
                  {/* Scanning Line */}
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  />
                  <span className="relative z-10">{">>> START LEARNING"}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

// UPDATED SkillCard component to match the "About" section style
function SkillCard({ skill, onClick }: { skill: any; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="flex-shrink-0 w-56 h-48 cursor-pointer group p-2" // Increased size for better readability
      onClick={onClick}
    >
      <div className="w-full h-full bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm text-left hover:bg-white/10 transition-all duration-300 p-4 flex flex-col">
        <div className="text-3xl mb-4">{skill.icon}</div>
        <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
        <p className="text-sm text-gray-400 flex-grow">
          {skill.description.substring(0, 60)}... {/* Truncate description */}
        </p>
        <p className="text-xs text-[#ff003c] font-semibold mt-2">CLICK TO LEARN MORE</p>
      </div>
    </motion.div>
  )
}
