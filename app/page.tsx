import dynamic from "next/dynamic"
import Hero from "@/components/hero"

// Dynamically import components for lazy loading
const ProblemStatement = dynamic(() => import("@/components/problem-statement"), {
  loading: () => <div className="h-[500px] bg-slate-100 animate-pulse" />,
})
const SolutionFeatures = dynamic(() => import("@/components/solution-features"), {
  loading: () => <div className="h-[500px] bg-white animate-pulse" />,
})
const HowItWorks = dynamic(() => import("@/components/how-it-works"), {
  loading: () => <div className="h-[600px] bg-slate-50 animate-pulse" />,
})
const DemoSection = dynamic(() => import("@/components/demo-section"), {
  loading: () => <div className="h-[700px] bg-gradient-to-b from-slate-800 to-slate-900 animate-pulse" />,
})
const CallToAction = dynamic(() => import("@/components/call-to-action"), {
  loading: () => <div className="h-[300px] bg-white animate-pulse" />,
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProblemStatement />
      <SolutionFeatures />
      <HowItWorks />
      <DemoSection />
      <CallToAction />
    </main>
  )
}
