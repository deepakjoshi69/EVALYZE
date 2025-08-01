"use client"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import TrendingSkills from "@/components/trending-skills"
import Footer from "@/components/footer"

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TrendingSkills />
      <Footer />
    </div>
  )
}
