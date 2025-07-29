"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Play, RotateCcw, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"
import CodeEditor from "@/components/practice/code-editor"
import LoadingAnimation from "@/components/practice/loading-animation"

// Expanded list of 20 supported languages and their Judge0 API IDs
const supportedLanguages = [
  { id: 63, name: "JavaScript", value: "javascript" },
  { id: 71, name: "Python", value: "python" },
  { id: 62, name: "Java", value: "java" },
  { id: 54, name: "C++", value: "cpp" },
  { id: 74, name: "TypeScript", value: "typescript" },
  { id: 51, name: "C#", value: "csharp" },
  { id: 60, name: "Go", value: "go" },
  { id: 73, name: "Rust", value: "rust" },
  { id: 72, name: "Ruby", value: "ruby" },
  { id: 70, name: "PHP", value: "php" },
  { id: 78, name: "Kotlin", value: "kotlin" },
  { id: 79, name: "Swift", value: "swift" },
  { id: 82, name: "SQL", value: "sql" },
  { id: 50, name: "C", value: "c" },
  { id: 68, name: "PHP", value: "php" },
  { id: 81, name: "Scala", value: "scala" },
  { id: 83, name: "Pascal", value: "pascal" },
  { id: 91, name: "Perl", value: "perl" },
  { id: 64, name: "Lua", value: "lua" },
  { id: 80, name: "R", value: "r" },
];

interface ProblemData {
  slug: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examples: Array<{ input: string; output: string; explanation?: string; }>;
  constraints: string[];
  starterCode: string;
}

export default function ProblemPage() {
  const params = useParams();
  const topic = params.topic as string;
  const problemSlug = params.problem as string;

  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(supportedLanguages[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadProblem = () => {
      if (topic && problemSlug) {
        const storedProblems = localStorage.getItem(`problems-${topic}`);
        if (storedProblems) {
          const problems: ProblemData[] = JSON.parse(storedProblems);
          const currentProblem = problems.find(p => p.slug === problemSlug);
          if (currentProblem) {
            setProblemData(currentProblem);
            setCode(currentProblem.starterCode || `function solve() {\n  // Start coding here\n}`);
          }
        }
      }
      setLoading(false);
    };
    loadProblem();
  }, [topic, problemSlug]);

  const handleLanguageChange = async (language: typeof supportedLanguages[0]) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
    if (problemData) {
      setCode(`// Generating ${language.name} starter code...`);
      try {
        const response = await fetch('/api/generate-starter-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: problemData.description, language: language.name }),
        });
        const data = await response.json();
        if (data.starterCode) {
          setCode(data.starterCode);
        } else {
          setCode(`// Could not generate starter code for ${language.name}. Please start from scratch.`);
        }
      } catch (error) {
        console.error("Failed to generate starter code:", error);
        setCode(`// Error generating code for ${language.name}.`);
      }
    }
  };

  const executeCode = async () => {
    setExecuting(true);
    setOutput("Executing code...");
    try {
      const response = await fetch('/api/submit-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language_id: selectedLanguage.id }),
      });
      const result = await response.json();
      
      if (result.stdout) {
        setOutput(`Success!\n\nOutput:\n${result.stdout}`);
      } else if (result.stderr) {
        setOutput(`Error:\n\n${result.stderr}`);
      } else if (result.status) {
        setOutput(`Execution finished:\n\n${result.status.description}`);
      } else {
        setOutput(`An unexpected error occurred: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      setOutput("An error occurred while submitting your code.");
    } finally {
      setExecuting(false);
    }
  };

  const resetCode = () => {
    if (problemData) {
      // When resetting, generate the starter code for the currently selected language
      handleLanguageChange(selectedLanguage);
      setOutput("");
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!problemData) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Problem not found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            <Link href={`/practice/${topic}`}>
              <Button variant="outline" className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Problems
              </Button>
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold font-mono">{problemData.title}</h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: problemData.difficulty === "Easy" ? "#00ff6620" : problemData.difficulty === "Medium" ? "#ffaa0020" : "#ff003c20", color: problemData.difficulty === "Easy" ? "#00ff66" : problemData.difficulty === "Medium" ? "#ffaa00" : "#ff003c", border: `1px solid ${problemData.difficulty === "Easy" ? "#00ff6640" : problemData.difficulty === "Medium" ? "#ffaa0040" : "#ff003c40"}` }}>{problemData.difficulty}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">{problemData.description}</p>
                <h3 className="text-xl font-semibold text-white mb-4">Examples:</h3>
                {problemData.examples?.map((example, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-4 mb-4 border border-gray-700">
                    <div className="mb-3"><h4 className="text-sm font-semibold text-gray-400 mb-2">Input:</h4><pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{example.input}</pre></div>
                    <div className="mb-3"><h4 className="text-sm font-semibold text-gray-400 mb-2">Output:</h4><pre className="text-sm text-blue-400 font-mono whitespace-pre-wrap">{example.output}</pre></div>
                    {example.explanation && (<div><h4 className="text-sm font-semibold text-gray-400 mb-2">Explanation:</h4><p className="text-sm text-gray-300">{example.explanation}</p></div>)}
                  </div>
                ))}
                <h3 className="text-xl font-semibold text-white mb-4">Constraints:</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  {problemData.constraints?.map((constraint, index) => (<li key={index} className="text-sm">{constraint}</li>))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="border-b border-gray-700 p-4 flex items-center justify-between bg-gray-900/50">
            <div className="flex items-center space-x-4">
              <Button onClick={executeCode} disabled={executing} className="bg-green-600 hover:bg-green-700 disabled:opacity-50">
                <Play className="w-4 h-4 mr-2" />
                {executing ? "Running..." : "Submit"}
              </Button>
              <Button onClick={resetCode} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="relative">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {selectedLanguage.name}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {supportedLanguages.map(lang => (
                    <div key={lang.id} onClick={() => handleLanguageChange(lang)} className="px-4 py-2 hover:bg-red-500/20 cursor-pointer">{lang.name}</div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} language={selectedLanguage.value} />
          </div>
          <div className="h-48 border-t border-gray-700 bg-gray-900/50">
            <div className="p-4 h-full overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Output:</h3>
              {output ? (<pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{output}</pre>) : (<p className="text-sm text-gray-500 italic">Your code's output will appear here...</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
