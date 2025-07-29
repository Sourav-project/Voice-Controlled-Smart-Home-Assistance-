"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Smartphone, Layers, AlertTriangle, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ProblemStatement() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const problems = [
    {
      icon: <Smartphone className="h-8 w-8 text-red-500" />,
      title: "Multiple Apps & Interfaces",
      description: "Managing different apps for each smart device creates a fragmented user experience.",
    },
    {
      icon: <Layers className="h-8 w-8 text-red-500" />,
      title: "Complex Setup Process",
      description: "Setting up and connecting multiple devices requires technical knowledge and patience.",
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
      title: "Inconsistent Controls",
      description: "Different voice commands for different brands lead to confusion and frustration.",
    },
    {
      icon: <Zap className="h-8 w-8 text-red-500" />,
      title: "Limited Customization",
      description: "Existing solutions offer minimal personalization for specific user needs.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section ref={ref} className="py-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Problem</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            As smart home devices become increasingly popular, managing multiple devices through different apps and
            interfaces can be cumbersome.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {problems.map((problem, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                  <p className="text-slate-600">{problem.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
