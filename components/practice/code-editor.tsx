"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
}

export default function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const [focused, setFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const lineNumbers = value.split("\n").map((_, index) => index + 1)

  return (
    <div className="h-full bg-gray-900 relative overflow-hidden">
      {/* Scanning Line Effect */}
      <motion.div
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff003c]/50 to-transparent opacity-30 z-10"
      />

      <div className="flex h-full">
        {/* Line Numbers */}
        <div className="bg-gray-800 px-4 py-4 text-right text-gray-500 font-mono text-sm select-none border-r border-gray-700">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full h-full p-4 bg-transparent text-white font-mono text-sm resize-none outline-none leading-6"
            style={{
              tabSize: 2,
            }}
            placeholder="// Write your code here..."
            spellCheck={false}
          />

          {/* Focus Border Effect */}
          {focused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 border-2 border-[#ff003c]/30 pointer-events-none"
            />
          )}

          {/* Syntax Highlighting Overlay (simplified) */}
          <div className="absolute inset-0 pointer-events-none p-4 font-mono text-sm leading-6 overflow-hidden">
            <pre className="text-transparent">
              {value.split("\n").map((line, index) => (
                <div key={index}>
                  {line.split(" ").map((word, wordIndex) => {
                    let color = "transparent"
                    if (["function", "const", "let", "var", "if", "else", "for", "while", "return"].includes(word)) {
                      color = "#ff6b9d"
                    } else if (word.includes("(") || word.includes(")")) {
                      color = "#c792ea"
                    } else if (word.startsWith("//")) {
                      color = "#5c6370"
                    }
                    return (
                      <span key={wordIndex} style={{ color }}>
                        {word}
                        {wordIndex < line.split(" ").length - 1 ? " " : ""}
                      </span>
                    )
                  })}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
