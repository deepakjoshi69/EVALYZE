"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, AlertTriangle } from "lucide-react"
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

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

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

  const getTimerDuration = useCallback(() => {
    switch (level) {
      case "beginner": return 2 * 60;
      case "intermediate": return 5 * 60;
      case "advanced": return 10 * 60;
      default: return 2 * 60;
    }
  }, [level]);

  useEffect(() => {
    // THIS IS THE FIX: Load questions from localStorage instead of using mock data
    const loadQuestions = () => {
      setLoading(true);
      const storedQuestions = localStorage.getItem('currentTestQuestions');
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      }
      setTimeLeft(getTimerDuration());
      setQuestionStartTime(Date.now());
      setLoading(false);
    };
    loadQuestions();
  }, [getTimerDuration]);

  useEffect(() => {
    if (timeLeft > 0 && !loading && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !loading && !showResults) {
      handleNextQuestion();
    }
  }, [timeLeft, loading, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNextQuestion = useCallback(() => {
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
      const isCorrect = currentAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
      const newAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        answer: currentAnswer,
        isCorrect,
        timeSpent,
      };
      setUserAnswers((prev) => [...prev, newAnswer]);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setTimeLeft(getTimerDuration());
      setQuestionStartTime(Date.now());
    } else {
      setShowResults(true);
    }
  }, [currentQuestionIndex, questions, currentAnswer, questionStartTime, getTimerDuration]);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevAnswer = userAnswers.find((a) => a.questionId === questions[currentQuestionIndex - 1]?.id);
      setCurrentAnswer(prevAnswer?.answer || "");
      setTimeLeft(getTimerDuration());
      setQuestionStartTime(Date.now());
    }
  };

  const handleFinishTest = () => {
    handleNextQuestion();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Memoize the shuffled options so they don't re-shuffle on every render
  const shuffledOptions = useMemo(() => {
    if (currentQuestion?.type === "theoretical" && currentQuestion.options) {
      return shuffleArray(currentQuestion.options);
    }
    return [];
  }, [currentQuestion]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pt-16">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff003c]/5 via-transparent to-[#a100ff]/5" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
      </div>
      <div className="flex-1 bg-black relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm h-fit">
              <h2 className="text-2xl font-semibold text-[#ff003c] mb-6 font-mono">QUESTION {currentQuestionIndex + 1}</h2>
              <div className="text-white text-lg leading-relaxed mb-6 select-none" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
                {currentQuestion?.question}
              </div>
              {currentQuestion?.type === "theoretical" && (
                <div className="space-y-3">
                  {shuffledOptions.map((option, index) => (
                    <motion.button key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setCurrentAnswer(option)} className={`w-full text-left p-4 rounded-lg border transition-all ${currentAnswer === option ? "border-[#ff003c] bg-[#ff003c]/10 text-white" : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"}`}>
                      <span className="font-mono mr-3 text-[#ff003c]">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4 font-mono">{skill.replace(/-/g, " ").toUpperCase()} Assessment</h3>
              <p className="text-gray-300 leading-relaxed mb-6">You are taking a <span className="text-[#ff003c] font-semibold">{level}</span> level <span className="text-[#a100ff] font-semibold">{testType}</span> test on <span className="text-white font-semibold">{skill.replace(/-/g, " ")}</span>.</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Time per question: {Math.floor(getTimerDuration() / 60)} minutes</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-[#ff003c] to-[#a100ff] h-3 rounded-full" />
              </div>
            </motion.div>
          </div>
          {currentQuestion?.type === "technical" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm mb-8">
              <h3 className="text-xl font-semibold text-[#a100ff] mb-4 font-mono">YOUR SOLUTION</h3>
              <Textarea value={currentAnswer} onChange={(e) => setCurrentAnswer(e.target.value)} placeholder="Write your code solution here..." className="w-full h-40 bg-black/50 border-gray-600 text-white font-mono text-sm resize-none focus:border-[#ff003c] transition-colors" />
            </motion.div>
          )}
          <div className="flex justify-between items-center">
            <Button onClick={handlePreviousQuestion} disabled={isFirstQuestion} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent disabled:opacity-50 px-8 py-3"><ArrowLeft className="w-4 h-4 mr-2" />Previous</Button>
            <div className="flex space-x-4">
              {!isLastQuestion ? (
                <Button onClick={handleNextQuestion} className="bg-gradient-to-r from-[#ff003c] to-[#a100ff] hover:scale-105 transition-transform px-8 py-3 font-mono">Next<ArrowRight className="w-4 h-4 ml-2" /></Button>
              ) : (
                <Button onClick={handleFinishTest} className="bg-gradient-to-r from-green-600 to-green-700 hover:scale-105 transition-transform px-8 py-3 font-mono"><CheckCircle className="w-4 h-4 mr-2" />Finish Test</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showResults && (
          <TestResultsModal questions={questions} userAnswers={userAnswers} skill={skill.replace(/-/g, " ")} level={level} testType={testType} onClose={() => router.push("/test")} />
        )}
      </AnimatePresence>
      <div className="bg-black"><Footer /></div>
    </div>
  )
}
