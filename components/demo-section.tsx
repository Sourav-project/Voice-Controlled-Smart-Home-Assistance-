"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Mic, Lightbulb, Thermometer, Lock, Speaker } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DemoSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [isListening, setIsListening] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  const [deviceStates, setDeviceStates] = useState({
    lights: false,
    thermostat: 70,
    door: "locked",
    music: false,
  })

  const handleCommand = (command: string) => {
    setIsListening(true)
    setActiveCommand(command)

    setTimeout(() => {
      switch (command) {
        case "Turn on the lights":
          setDeviceStates((prev) => ({ ...prev, lights: true }))
          break
        case "Set temperature to 72":
          setDeviceStates((prev) => ({ ...prev, thermostat: 72 }))
          break
        case "Unlock the front door":
          setDeviceStates((prev) => ({ ...prev, door: "unlocked" }))
          break
        case "Play my favorite playlist":
          setDeviceStates((prev) => ({ ...prev, music: true }))
          break
      }

      setIsListening(false)
    }, 2000)
  }

  const commands = [
    { text: "Turn on the lights", icon: <Lightbulb /> },
    { text: "Set temperature to 72", icon: <Thermometer /> },
    { text: "Unlock the front door", icon: <Lock /> },
    { text: "Play my favorite playlist", icon: <Speaker /> },
  ]

  return (
    <section ref={ref} id="demo" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Try out these commands to see how our voice assistant would control your smart home.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Command Panel */}
          <motion.div
            className="bg-slate-700 p-6 rounded-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Mic className="mr-2" /> Voice Commands
            </h3>

            <div className="space-y-4">
              {commands.map((command, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left py-4 bg-slate-800 border-slate-600 hover:bg-slate-700"
                    onClick={() => handleCommand(command.text)}
                    disabled={isListening}
                  >
                    <span className="mr-3">{command.icon}</span>
                    {command.text}
                  </Button>
                </motion.div>
              ))}
            </div>

            {isListening && (
              <div className="mt-6 p-4 bg-slate-800 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  >
                    <Mic className="text-blue-400" />
                  </motion.div>
                </div>
                <p>Listening: "{activeCommand}"</p>
              </div>
            )}
          </motion.div>

          {/* Smart Home Visualization */}
          <motion.div
            className="bg-slate-700 p-6 rounded-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-6">Smart Home Status</h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center">
                  <Lightbulb className={deviceStates.lights ? "text-yellow-300" : "text-slate-500"} />
                  <span className="ml-3">Living Room Lights</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${deviceStates.lights ? "bg-green-500/20 text-green-400" : "bg-slate-600/20 text-slate-400"}`}
                >
                  {deviceStates.lights ? "ON" : "OFF"}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center">
                  <Thermometer className="text-blue-400" />
                  <span className="ml-3">Thermostat</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">{deviceStates.thermostat}°F</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center">
                  <Lock className={deviceStates.door === "locked" ? "text-green-400" : "text-red-400"} />
                  <span className="ml-3">Front Door</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${deviceStates.door === "locked" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                >
                  {deviceStates.door.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center">
                  <Speaker className={deviceStates.music ? "text-purple-400" : "text-slate-500"} />
                  <span className="ml-3">Music System</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${deviceStates.music ? "bg-purple-500/20 text-purple-400" : "bg-slate-600/20 text-slate-400"}`}
                >
                  {deviceStates.music ? "PLAYING" : "OFF"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
