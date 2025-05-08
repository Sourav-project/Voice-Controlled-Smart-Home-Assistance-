"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Layers, Settings, Eye, Wifi, Shield } from "lucide-react"

export default function SolutionFeatures() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: <Layers className="h-12 w-12 text-blue-500" />,
      title: "Multi-Device Control",
      description: "Manage different brands and types of devices through a single voice command.",
    },
    {
      icon: <Settings className="h-12 w-12 text-blue-500" />,
      title: "Advanced Customization",
      description: "Create custom voice commands and automation routines tailored to your needs.",
    },
    {
      icon: <Eye className="h-12 w-12 text-blue-500" />,
      title: "Context-Aware Commands",
      description: "Automatically adjust settings based on your current environment and activities.",
    },
    {
      icon: <Wifi className="h-12 w-12 text-blue-500" />,
      title: "Offline Functionality",
      description: "Perform basic tasks without an internet connection for increased reliability.",
    },
    {
      icon: <Shield className="h-12 w-12 text-blue-500" />,
      title: "Enhanced Security",
      description: "Voice recognition for user authentication and secure device access.",
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Solution</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            A Voice-Controlled Smart Home Assistant that integrates with various IoT devices and offers a unified,
            intuitive voice interface.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

