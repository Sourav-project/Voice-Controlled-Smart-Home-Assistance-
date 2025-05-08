import Hero from "@/components/hero"
import ProblemStatement from "@/components/problem-statement"
import SolutionFeatures from "@/components/solution-features"
import HowItWorks from "@/components/how-it-works"
import DemoSection from "@/components/demo-section"
import CallToAction from "@/components/call-to-action"

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

