"use client"

import { motion } from "framer-motion"
import { X, CheckCircle, XCircle, Clock, Trophy, Target, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface TestResultsModalProps {
  questions: Question[]
  userAnswers: UserAnswer[]
  skill: string
  level: string
  testType: string
  onClose: () => void
}

export default function TestResultsModal({
  questions,
  userAnswers,
  skill,
  level,
  testType,
  onClose,
}: TestResultsModalProps) {
  const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length
  const totalQuestions = questions.length
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)
  const totalTimeSpent = userAnswers.reduce((total, answer) => total + answer.timeSpent, 0)

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "#00ff66"
    if (scorePercentage >= 60) return "#ffaa00"
    return "#ff003c"
  }

  const getScoreGrade = () => {
    if (scorePercentage >= 90) return "Excellent"
    if (scorePercentage >= 80) return "Very Good"
    if (scorePercentage >= 70) return "Good"
    if (scorePercentage >= 60) return "Fair"
    return "Needs Improvement"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#ff003c]/50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
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
              "linear-gradient(135deg, transparent, rgba(161, 0, 255, 0.1))",
              "linear-gradient(45deg, rgba(255, 0, 60, 0.1), transparent)",
            ],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="absolute inset-0"
        />

        <div className="relative z-10 p-8 overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white font-mono mb-2">Test Results</h2>
              <p className="text-gray-400">
                {skill} • {level} • {testType}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Score Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Overall Score */}
            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-3" style={{ color: getScoreColor() }} />
              <div className="text-3xl font-bold text-white mb-1" style={{ color: getScoreColor() }}>
                {scorePercentage}%
              </div>
              <div className="text-sm text-gray-400">{getScoreGrade()}</div>
            </div>

            {/* Correct Answers */}
            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>

            {/* Accuracy */}
            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{scorePercentage}%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>

            {/* Time Spent */}
            <div className="bg-black/50 border border-gray-700 rounded-lg p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{formatTime(totalTimeSpent)}</div>
              <div className="text-sm text-gray-400">Total Time</div>
            </div>
          </div>

          {/* Performance Feedback */}
          <div className="bg-black/50 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-[#a100ff]" />
              <h3 className="text-xl font-bold text-white font-mono">Performance Analysis</h3>
            </div>
            <div className="text-gray-300 leading-relaxed">
              {scorePercentage >= 80 ? (
                <p>
                  <span className="text-green-400 font-semibold">Excellent work!</span> You demonstrated strong
                  understanding of {skill}. Your performance indicates solid mastery of the concepts at the {level}{" "}
                  level.
                </p>
              ) : scorePercentage >= 60 ? (
                <p>
                  <span className="text-yellow-400 font-semibold">Good effort!</span> You have a decent grasp of {skill}
                  , but there's room for improvement. Consider reviewing the areas where you struggled and practicing
                  more.
                </p>
              ) : (
                <p>
                  <span className="text-red-400 font-semibold">Keep practicing!</span> This assessment shows you need
                  more work on {skill}. Don't be discouraged - use this as a learning opportunity to identify areas for
                  improvement.
                </p>
              )}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-mono mb-4">Question Review</h3>
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find((a) => a.questionId === question.id)
              const isCorrect = userAnswer?.isCorrect || false

              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-black/50 border rounded-lg p-6 ${
                    isCorrect ? "border-green-500/30" : "border-red-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                      )}
                      <h4 className="text-lg font-semibold text-white">Question {index + 1}</h4>
                    </div>
                    <div className="text-sm text-gray-400">Time: {formatTime(userAnswer?.timeSpent || 0)}</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-300 mb-2">{question.question}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-400 mb-2">Your Answer:</h5>
                        <div
                          className={`p-3 rounded border ${
                            isCorrect ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
                          }`}
                        >
                          <p className="text-white text-sm font-mono">{userAnswer?.answer || "No answer provided"}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-gray-400 mb-2">Correct Answer:</h5>
                        <div className="p-3 rounded border border-blue-500/30 bg-blue-500/10">
                          <p className="text-white text-sm font-mono">{question.correctAnswer}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-gray-400 mb-2">Explanation:</h5>
                      <p className="text-gray-300 text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8 pt-8 border-t border-gray-700">
            <Button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-[#ff003c] to-[#a100ff] hover:scale-105 transition-transform font-mono"
            >
              Take Another Test
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent font-mono"
            >
              Review Study Materials
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
