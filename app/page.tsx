"use client"

import Homepage from "@/components/homepage"

export default function App() {
  return (
    // This main container now directly renders your homepage
    <main className="min-h-screen bg-black">
      <Homepage />
    </main>
  )
}
