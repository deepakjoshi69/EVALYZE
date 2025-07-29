"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, CheckCircle, Flame, Target, ArrowLeft } from "lucide-react" // Added ArrowLeft
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce"

const topics = [
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Master fundamental algorithms and data structures.",
    icon: "🔧",
    color: "#ff003c",
    problems: 45,
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Deepen your understanding of core data structures.",
    icon: "🗄️",
    color: "#0066ff",
    problems: 38,
  },
  {
    id: "react",
    title: "React",
    description: "Solve challenges related to modern web development.",
    icon: "⚛️",
    color: "#00ff66",
    problems: 32,
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Practice core JavaScript concepts and patterns.",
    icon: "🟨",
    color: "#ffff00",
    problems: 42,
  },
  {
    id: "python",
    title: "Python",
    description: "Enhance your Python programming skills.",
    icon: "🐍",
    color: "#a100ff",
    problems: 51,
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Learn to design scalable distributed systems.",
    icon: "🏗️",
    color: "#ff6600",
    problems: 28,
  },
]

const difficulties = ["All", "Easy", "Medium", "Hard"]

export default function PracticePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const handleGenerateProblems = async (topic: string) => {
    if (!topic) return;
    setIsLoading(true);
    setSuggestions([]);
    try {
      const response = await fetch('/api/generate-problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      
      if (response.ok) {
        const topicSlug = topic.toLowerCase().replace(/ /g, "-");
        localStorage.setItem(`problems-${topicSlug}`, JSON.stringify(data.problems));
        router.push(`/practice/${topicSlug}`);
      } else {
        console.error("API Error:", data.error);
      }
    } catch (error) {
      console.error("Failed to generate problems:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm) {
        try {
          const response = await fetch('/api/generate-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: debouncedSearchTerm }),
          });
          const data = await response.json();
          if (data.suggestions) {
            setSuggestions(data.suggestions);
          }
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-black text-white">
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-orbitron">Generating Problems with Gemini...</p>
        </div>
      )}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff003c]/5 via-transparent to-[#a100ff]/5" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* THIS IS THE FIX: Added a "Back to Home" button */}
        <div className="mb-8">
            <Link href="/">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <h1 className="text-6xl font-bold font-mono mb-4">Practice <span className="text-[#ff003c]">Zone</span></h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Select a topic to begin honing your skills. Filter by difficulty or search for a specific challenge.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search for a topic (e.g., 'React Hooks')..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400 h-12" />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <div key={index} onClick={() => { setSearchTerm(suggestion); setSuggestions([]); }} className="p-3 hover:bg-red-500/20 cursor-pointer text-white">{suggestion}</div>
                ))}
              </div>
            )}
          </div>
          <Button onClick={() => handleGenerateProblems(searchTerm)} disabled={isLoading || !searchTerm} className="bg-[#ff003c] hover:bg-[#ff003c]/80 h-12 px-8">Search</Button>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 whitespace-nowrap">Difficulty:</span>
            <div className="flex space-x-2">
              {difficulties.map((difficulty) => (
                <Button key={difficulty} variant={selectedDifficulty === difficulty ? "default" : "outline"} size="sm" onClick={() => setSelectedDifficulty(difficulty)} className={selectedDifficulty === difficulty ? "bg-[#ff003c] hover:bg-[#ff003c]/80" : "border-gray-600 text-gray-300 hover:bg-gray-800"}>{difficulty}</Button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <motion.div key={topic.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * index }} whileHover={{ scale: 1.02, y: -5 }} className="group">
              <div onClick={() => handleGenerateProblems(topic.title)} className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm hover:border-[#ff003c]/50 transition-all duration-300 cursor-pointer relative overflow-hidden h-full flex flex-col" style={{ clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))" }}>
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 bg-gradient-to-br from-[#ff003c]/10 to-[#a100ff]/10" />
                <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100" />
                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl p-3 rounded-lg border" style={{ borderColor: `${topic.color}30`, backgroundColor: `${topic.color}20` }}>{topic.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white font-mono">{topic.title}</h3>
                      <p className="text-gray-400 text-sm">{topic.problems} problems</p>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed flex-grow">{topic.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <motion.div whileHover={{ x: 5 }} className="text-[#ff003c] font-mono font-semibold flex items-center space-x-2">
                      <span>Start Practicing</span>
                      <span>→</span>
                    </motion.div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }} className="w-2 h-2 rounded-full" style={{ backgroundColor: topic.color }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
