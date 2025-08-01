"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Mic, Cpu, Zap, Check } from "lucide-react"

export default function HowItWorks() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      icon: <Mic className="h-10 w-10 text-white" />,
      title: "Voice Command",
      description: "Speak naturally to your assistant using everyday language",
      color: "bg-blue-500",
    },
    {
      icon: <Cpu className="h-10 w-10 text-white" />,
      title: "Processing",
      description: "Advanced AI interprets your intent and context",
      color: "bg-purple-500",
    },
    {
      icon: <Zap className="h-10 w-10 text-white" />,
      title: "Execution",
      description: "Commands are sent to the appropriate devices",
      color: "bg-green-500",
    },
    {
      icon: <Check className="h-10 w-10 text-white" />,
      title: "Confirmation",
      description: "Receive feedback on completed actions",
      color: "bg-teal-500",
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our voice assistant uses advanced AI to understand your commands and control your smart home devices
            seamlessly.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative mb-16 last:mb-0 md:flex items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className={`flex flex-col items-center md:items-center md:pr-12 md:pl-12`}>
                <div className={`${step.color} rounded-full p-4 mb-4 z-10`}>{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-600 text-center md:text-center">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
