"use client"

import { motion } from "framer-motion"
import { BrainCircuit, Target, TrendingUp, CheckCircle } from "lucide-react"

// Data for the feature cards
const steps = [
  {
    icon: <BrainCircuit className="w-10 h-10 text-[#ff003c]" />,
    title: "Practice & Assess",
    description: "Engage with interactive coding challenges and take AI-powered assessments to accurately gauge your current skill level.",
  },
  {
    icon: <Target className="w-10 h-10 text-[#ff003c]" />,
    title: "Identify Gaps",
    description: "Our system analyzes your performance to pinpoint specific knowledge gaps and areas for improvement in your technical skills.",
  },
  {
    icon: <TrendingUp className="w-10 h-10 text-[#ff003c]" />,
    title: "Personalized Path",
    description: "Receive a customized learning roadmap with curated resources and projects designed to accelerate your career growth.",
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-[#ff003c]" />,
    title: "Prepare & Succeed",
    description: "Utilize our interview preparation tools, including mock interviews and common questions, to land your dream job.",
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-black/50 border-t border-gray-800 py-12 px-6">
      {/* The updated background gradient with more black */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "radial-gradient(ellipse 30% 40% at 80% 20%, rgba(153, 27, 27, 0.15), transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Main Title */}
          <h2 className="text-5xl font-bold text-white mb-4 font-orbitron">
            ABOUT
          </h2>
          
          {/* Subtitle */}
          <p className="text-2xl text-gray-400 mb-12">
            How <span className="text-[#ff003c] font-semibold">EVALYZE</span> Works
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm text-left hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
