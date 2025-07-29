"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Logo and Description */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              <span className="text-[#ff003c]">EVAL</span>YZE
            </div>
            <p className="text-gray-400">
              Boost your IT career with our comprehensive platform for coding practice, skill testing, and interview
              preparation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-gray-400 hover:text-[#ff003c] transition-colors">
                Home
              </a>
              <a href="#about" className="block text-gray-400 hover:text-[#ff003c] transition-colors">
                About
              </a>
              <a href="#contact" className="block text-gray-400 hover:text-[#ff003c] transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#ff003c] transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff003c] transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff003c] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 Evalyze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
