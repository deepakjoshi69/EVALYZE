"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import LoadingAnimation from "@/components/practice/loading-animation"

interface Problem {
  id: string
  slug: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  status: "solved" | "attempted" | "unsolved"
  timeEstimate: string
}

const topicTitles: Record<string, string> = {
  algorithms: "Algorithms",
  "data-structures": "Data Structures",
  react: "React",
  javascript: "JavaScript",
  python: "Python",
  "system-design": "System Design",
}

export default function TopicPage() {
  const params = useParams()
  const topic = params.topic as string
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This function now loads the dynamically generated problems
    const loadProblems = () => {
      setLoading(true);
      // Retrieve the problems from localStorage that were saved on the previous page
      const storedProblems = localStorage.getItem(`problems-${topic}`);
      if (storedProblems) {
        const parsedProblems = JSON.parse(storedProblems);
        // Add default status and time estimate for the UI
        const problemsWithDefaults = parsedProblems.map((p: Problem) => ({
          ...p,
          id: p.slug, // Use slug as a unique ID
          status: 'unsolved', 
          timeEstimate: `${Math.floor(Math.random() * 30) + 30} min`
        }));
        setProblems(problemsWithDefaults);
      }
      setLoading(false);
    };

    if (topic) {
      loadProblems();
    }
  }, [topic])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#00ff66"
      case "Medium":
        return "#ffaa00"
      case "Hard":
        return "#ff003c"
      default:
        return "#ffffff"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "attempted":
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <X className="w-5 h-5 text-gray-500" />
    }
  }

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <div className="min-h-screen bg-black text-white">
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

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <Link href="/practice">
            <Button variant="outline" className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Practice
            </Button>
          </Link>

          <h1 className="text-6xl font-bold font-mono text-center mb-4">{topicTitles[topic] || topic.replace(/-/g, ' ')}</h1>
          <p className="text-xl text-gray-300 text-center">Select a problem to begin.</p>
        </motion.div>

        {/* Problems Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg overflow-hidden backdrop-blur-sm"
        >
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-700 bg-gray-800/50">
            <div className="col-span-1 text-gray-400 font-semibold">Status</div>
            <div className="col-span-7 text-gray-400 font-semibold">Problem Title</div>
            <div className="col-span-2 text-gray-400 font-semibold">Difficulty</div>
            <div className="col-span-2 text-gray-400 font-semibold">Time</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ backgroundColor: "rgba(255, 0, 60, 0.05)" }}
                className="grid grid-cols-12 gap-4 p-6 transition-colors"
              >
                <Link href={`/practice/${topic}/${problem.slug}`} className="contents">
                  <div className="col-span-1 flex items-center">{getStatusIcon(problem.status)}</div>

                  <div className="col-span-7 flex items-center">
                    <span className="text-white font-medium hover:text-[#ff003c] transition-colors">
                      {problem.title}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: `${getDifficultyColor(problem.difficulty)}20`,
                        color: getDifficultyColor(problem.difficulty),
                        border: `1px solid ${getDifficultyColor(problem.difficulty)}40`,
                      }}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-gray-400 text-sm">{problem.timeEstimate}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
