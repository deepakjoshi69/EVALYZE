"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Search, Play, Settings, Brain, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/useDebounce" // Assuming you have this hook

export default function TestSetupPage() {
  const router = useRouter()
  const [skill, setSkill] = useState("")
  const [level, setLevel] = useState("")
  const [testType, setTestType] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null) // Ref for the search container

  // Use a 2-second debounce for fetching suggestions
  const debouncedSearchTerm = useDebounce(skill, 1000)

  // Effect to fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Fetch suggestions only after the user has stopped typing for 2 seconds
      if (debouncedSearchTerm.length > 1) {
        try {
          const response = await fetch('/api/test-suggestions', {
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

  // Effect to hide suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  // This function is called ONLY when the "START TEST" button is clicked
  const handleStartTest = async () => {
    if (skill && level && testType) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/generate-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill, level, testType }),
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('currentTestQuestions', JSON.stringify(data.questions));
          const encodedSkill = encodeURIComponent(skill.toLowerCase().replace(/\s+/g, "-"))
          router.push(`/test/${encodedSkill}?level=${level}&type=${testType}`)
        } else {
          console.error("API Error:", data.error);
        }
      } catch (error) {
        console.error("Failed to generate test:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const isFormValid = skill && level && testType

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-xl font-orbitron">Generating Your Test...</p>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff003c]/5 via-transparent to-[#a100ff]/5" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }}/>
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-[#ff003c] rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ duration: 3 + Math.random() * 2, repeat: Number.POSITIVE_INFINITY, delay: Math.random() * 2 }}/>
        ))}
      </div>

      <div className="relative z-10 flex-1 bg-black">
        <div className="container mx-auto px-6 py-12 lg:py-24 min-h-[calc(100vh-200px)]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold font-mono mb-6">Skill Assessment <span className="text-[#ff003c]">Test</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Challenge yourself with AI-generated tests tailored to your skill level. Measure your expertise and identify areas for improvement.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-2xl mx-auto mb-12">
            <div className="relative" ref={searchContainerRef}>
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                placeholder="Enter any technical skill (e.g., React Hooks, Python Data Structures)..."
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="pl-16 pr-6 py-6 text-lg bg-gray-900/50 border-2 border-gray-700 text-white placeholder-gray-400 rounded-lg focus:border-[#ff003c] transition-colors"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} onClick={() => { setSkill(suggestion); setSuggestions([]); }} className="p-3 hover:bg-red-500/20 cursor-pointer">{suggestion}</div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="max-w-4xl mx-auto mb-8 lg:mb-16">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-gray-700 rounded-lg p-6 lg:p-8 backdrop-blur-sm relative overflow-hidden" style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}>
              <motion.div animate={{ background: ["linear-gradient(45deg, rgba(255, 0, 60, 0.05), transparent)", "linear-gradient(135deg, transparent, rgba(161, 0, 255, 0.05))", "linear-gradient(45deg, rgba(255, 0, 60, 0.05), transparent)"] }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }} className="absolute inset-0" />
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <Settings className="w-6 h-6 text-[#ff003c]" />
                  <h2 className="text-2xl font-bold font-mono">Test Configuration</h2>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-400 mb-3 font-mono">SELECTED SKILL:</label>
                  <div className="bg-black/50 border border-[#ff003c]/30 rounded-lg p-4">
                    <p className="text-lg text-white font-mono">{skill || "No skill selected"}{skill && (<motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }} className="ml-2 text-[#ff003c]">|</motion.span>)}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-3 font-mono">DIFFICULTY LEVEL:</label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white h-12"><SelectValue placeholder="Select difficulty level" /></SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="beginner" className="text-green-400"><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>Beginner (2 min/question)</span></div></SelectItem>
                        <SelectItem value="intermediate" className="text-yellow-400"><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-yellow-400 rounded-full" /><span>Intermediate (5 min/question)</span></div></SelectItem>
                        <SelectItem value="advanced" className="text-red-400"><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-red-400 rounded-full" /><span>Advanced (10 min/question)</span></div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-3 font-mono">TEST TYPE:</label>
                    <Select value={testType} onValueChange={setTestType}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white h-12"><SelectValue placeholder="Select test type" /></SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="technical" className="text-blue-400"><div className="flex items-center space-x-2"><Code className="w-4 h-4" /><span>Technical Test (Coding Challenges)</span></div></SelectItem>
                        <SelectItem value="theoretical" className="text-purple-400"><div className="flex items-center space-x-2"><Brain className="w-4 h-4" /><span>Theoretical Test (Multiple Choice)</span></div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-center">
                  <Button onClick={handleStartTest} disabled={!isFormValid || isLoading} className={`px-12 py-6 text-xl font-bold font-mono tracking-wider relative overflow-hidden transition-all duration-500 ${isFormValid ? "bg-gradient-to-r from-[#ff003c] to-[#a100ff] hover:scale-105 hover:shadow-lg hover:shadow-[#ff003c]/25" : "bg-gray-700 cursor-not-allowed opacity-50"}`} style={{ clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}>
                    {isFormValid && (<motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />)}
                    <span className="relative z-10 flex items-center space-x-3"><Play className="w-6 h-6" /><span>{isFormValid ? ">>> START TEST" : ">>> COMPLETE CONFIGURATION"}</span></span>
                  </Button>
                  {isFormValid && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-400 mt-4 font-mono">{">"} Test will be generated using AI based on your selections</motion.p>)}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bg-black"><Footer /></div>
    </div>
  )
}
