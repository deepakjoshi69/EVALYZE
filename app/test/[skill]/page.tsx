"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import TestResultsModal from "@/components/test/test-results-modal"
import LoadingAnimation from "@/components/practice/loading-animation"

interface Question {
  id: number
  question: string
  type: "technical" | "theoretical"
  options?: string[]
  correctAnswer: string
  explanation: string
}

interface UserAnswer {
  questionId: number
  answer: string
  isCorrect: boolean
  timeSpent: number
}

export default function TestTakingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const skill = params.skill as string
  const level = searchParams.get("level") || "beginner"
  const testType = searchParams.get("type") || "technical"

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Timer duration based on level
  const getTimerDuration = () => {
    switch (level) {
      case "beginner":
        return 2 * 60 // 2 minutes
      case "intermediate":
        return 5 * 60 // 5 minutes
      case "advanced":
        return 10 * 60 // 10 minutes
      default:
        return 2 * 60
    }
  }

  // Load questions (mock implementation - replace with actual AI generation)
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate API call

      const mockQuestions: Question[] = [
        {
          id: 1,
          question:
            testType === "technical"
              ? `Write a function that implements a binary search algorithm for the skill: ${skill.replace(
                  /-/g,
                  " ",
                )}. The function should return the index of the target element or -1 if not found.`
              : `What is the time complexity of binary search algorithm in ${skill.replace(/-/g, " ")}?`,
          type: testType as "technical" | "theoretical",
          options: testType === "theoretical" ? ["O(1)", "O(log n)", "O(n)", "O(n log n)"] : undefined,
          correctAnswer: testType === "technical" ? "function binarySearch(arr, target) { ... }" : "O(log n)",
          explanation: "Binary search has O(log n) time complexity as it divides the search space in half each time.",
        },
        {
          id: 2,
          question:
            testType === "technical"
              ? `Implement a function that reverses a linked list for ${skill.replace(/-/g, " ")}. Show your solution step by step.`
              : `Which data structure is best suited for implementing a stack in ${skill.replace(/-/g, " ")}?`,
          type: testType as "technical" | "theoretical",
          options: testType === "theoretical" ? ["Array", "Linked List", "Tree", "Graph"] : undefined,
          correctAnswer: testType === "technical" ? "function reverseLinkedList(head) { ... }" : "Linked List",
          explanation: "Linked lists provide O(1) insertion and deletion at the head, perfect for stack operations.",
        },
        {
          id: 3,
          question:
            testType === "technical"
              ? `Create a function that finds the maximum subarray sum using Kadane's algorithm for ${skill.replace(
                  /-/g,
                  " ",
                )}.`
              : `What is the space complexity of Kadane's algorithm for maximum subarray sum in ${skill.replace(
                  /-/g,
                  " ",
                )}?`,
          type: testType as "technical" | "theoretical",
          options: testType === "theoretical" ? ["O(1)", "O(n)", "O(n²)", "O(log n)"] : undefined,
          correctAnswer: testType === "technical" ? "function maxSubarraySum(arr) { ... }" : "O(1)",
          explanation: "Kadane's algorithm uses constant extra space, only tracking current and maximum sum.",
        },
        {
          id: 4,
          question:
            testType === "technical"
              ? `Write a function to detect if a binary tree is balanced for ${skill.replace(/-/g, " ")}.`
              : `In a balanced binary tree, what is the maximum height difference between left and right subtrees?`,
          type: testType as "technical" | "theoretical",
          options: testType === "theoretical" ? ["0", "1", "2", "3"] : undefined,
          correctAnswer: testType === "technical" ? "function isBalanced(root) { ... }" : "1",
          explanation: "A balanced binary tree has height difference of at most 1 between left and right subtrees.",
        },
        {
          id: 5,
          question:
            testType === "technical"
              ? `Implement a hash table with collision resolution using chaining for ${skill.replace(/-/g, " ")}.`
              : `Which collision resolution technique uses linked lists at each hash table slot?`,
          type: testType as "technical" | "theoretical",
          options:
            testType === "theoretical"
              ? ["Linear Probing", "Quadratic Probing", "Chaining", "Double Hashing"]
              : undefined,
          correctAnswer: testType === "technical" ? "class HashTable { ... }" : "Chaining",
          explanation: "Chaining uses linked lists or arrays at each hash table slot to handle collisions.",
        },
      ]

      setQuestions(mockQuestions)
      setTimeLeft(getTimerDuration())
      setQuestionStartTime(Date.now())
      setLoading(false)
    }

    loadQuestions()
  }, [skill, level, testType])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !loading && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !loading) {
      handleNextQuestion() // Auto-advance when time runs out
    }
  }, [timeLeft, loading, showResults])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle answer submission
  const handleNextQuestion = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const currentQuestion = questions[currentQuestionIndex]

    if (currentQuestion) {
      const isCorrect = currentAnswer.toLowerCase().includes(currentQuestion.correctAnswer.toLowerCase())

      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        answer: currentAnswer,
        isCorrect,
        timeSpent,
      }

      setUserAnswers((prev) => [...prev, newAnswer])
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentAnswer("")
      setTimeLeft(getTimerDuration())
      setQuestionStartTime(Date.now())
    } else {
      setShowResults(true)
    }
  }, [currentQuestionIndex, questions, currentAnswer, questionStartTime])

  // Handle previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      // Restore previous answer if exists
      const prevAnswer = userAnswers.find((a) => a.questionId === questions[currentQuestionIndex - 1]?.id)
      setCurrentAnswer(prevAnswer?.answer || "")
      setTimeLeft(getTimerDuration())
      setQuestionStartTime(Date.now())
    }
  }

  // Handle finish test
  const handleFinishTest = () => {
    handleNextQuestion()
  }

  if (loading) {
    return <LoadingAnimation />
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16">
      <Navbar />

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

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ff003c] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="flex-1 bg-black relative z-10 ">
        <div className="container mx-auto px-6 py-12 ">
          {/* Main Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8 " >
            {/* Left Column - Question Panel */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm h-fit "
            >
              <h2 className="text-2xl font-semibold text-[#ff003c] mb-6 font-mono">
                QUESTION {currentQuestionIndex + 1}
              </h2>

              {/* Unselectable Question Text */}
              <div
                className="text-white text-lg leading-relaxed mb-6"
                style={{
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  WebkitTouchCallout: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                {currentQuestion?.question}
              </div>

              {/* Multiple Choice Options (for theoretical tests) */}
              {currentQuestion?.type === "theoretical" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentAnswer(option)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        currentAnswer === option
                          ? "border-[#ff003c] bg-[#ff003c]/10 text-white"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <span className="font-mono mr-3 text-[#ff003c]">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right Column - Assignment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                {skill.replace(/-/g, " ").toUpperCase()} Assessment
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                You are taking a <span className="text-[#ff003c] font-semibold">{level}</span> level{" "}
                <span className="text-[#a100ff] font-semibold">{testType}</span> test on{" "}
                <span className="text-white font-semibold">{skill.replace(/-/g, " ")}</span>. This assessment will
                evaluate your understanding and practical knowledge of the topic. Answer each question thoughtfully and
                manage your time effectively.
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>Time per question: {Math.floor(getTimerDuration() / 60)} minutes</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-[#ff003c] to-[#a100ff] h-3 rounded-full relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Answer Panel (Full Width) */}
          {currentQuestion?.type === "technical" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm mb-8"
            >
              <h3 className="text-xl font-semibold text-[#a100ff] mb-4 font-mono">YOUR SOLUTION</h3>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Write your code solution here..."
                className="w-full h-40 bg-black/50 border-gray-600 text-white font-mono text-sm resize-none focus:border-[#ff003c] transition-colors"
              />
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={isFirstQuestion}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent disabled:opacity-50 px-8 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-4">
              {!isLastQuestion ? (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-[#ff003c] to-[#a100ff] hover:scale-105 transition-transform px-8 py-3 font-mono"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinishTest}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:scale-105 transition-transform px-8 py-3 font-mono"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finish Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && (
          <TestResultsModal
            questions={questions}
            userAnswers={userAnswers}
            skill={skill.replace(/-/g, " ")}
            level={level}
            testType={testType}
            onClose={() => router.push("/test")}
          />
        )}
      </AnimatePresence>

      <div className="bg-black">
        <Footer />
      </div>
    </div>
  )
}
