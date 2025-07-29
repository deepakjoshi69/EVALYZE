"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import FancyButton from "./fancy-button"
import { LayoutDashboard, User } from "lucide-react"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-lg border border-white/10" />

        <div className="relative flex items-center justify-between w-full">
          <div className="text-2xl font-bold text-white font-orbitron">
            <span className="text-[#ff003c]">EVAL</span>YZE
          </div>

          <div className="hidden md:flex items-center space-x-8 font-tech text-lg">
            <a href="#home" className="text-white hover:text-[#ff003c] transition-colors">
              Home
            </a>
            <a href="#about" className="text-white hover:text-[#ff003c] transition-colors">
              About
            </a>
            <a href="#contact" className="text-white hover:text-[#ff003c] transition-colors">
              Contact Us
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* This will show only if the user is logged IN */}
            <SignedIn>
              <Link href="/practice">
                 <FancyButton icon={<LayoutDashboard className="w-4 h-4 mr-2" />}>
                    Dashboard
                 </FancyButton>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* This will show only if the user is logged OUT */}
            <SignedOut>
              <Link href="/sign-in">
                <FancyButton icon={<User className="w-4 h-4 mr-2" />}>
                  Account
                </FancyButton>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
