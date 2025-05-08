"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const [isListening, setIsListening] = useState(false)
  const [pulseAnimation, setPulseAnimation] = useState(false)

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseAnimation((prev) => !prev)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isListening])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: Math.random() * 10 + 10,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="z-10 text-center px-4 max-w-4xl">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 [text-shadow:_0_0_15px_rgba(255,255,255,0.5),_0_0_30px_rgba(59,130,246,0.5),_0_0_5px_#fff]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Voice-Controlled Smart Home Assistant
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-12 text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          One voice to control them all. Seamlessly integrate and manage all your smart home devices.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 relative"
        >
          {/* Siri-like colorful background effect */}
          {isListening && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 blur-md"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180],
                background: [
                  "linear-gradient(90deg, rgba(59,130,246,0.7) 0%, rgba(147,51,234,0.7) 50%, rgba(236,72,153,0.7) 100%)",
                  "linear-gradient(180deg, rgba(6,182,212,0.7) 0%, rgba(59,130,246,0.7) 50%, rgba(147,51,234,0.7) 100%)",
                  "linear-gradient(270deg, rgba(236,72,153,0.7) 0%, rgba(6,182,212,0.7) 50%, rgba(59,130,246,0.7) 100%)",
                  "linear-gradient(90deg, rgba(59,130,246,0.7) 0%, rgba(147,51,234,0.7) 50%, rgba(236,72,153,0.7) 100%)",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          )}

          <Button
            size="lg"
            className={`rounded-full h-24 w-24 p-0 relative z-10 ${
              isListening
                ? "bg-black/20 backdrop-blur-md border-2 border-white/30"
                : "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
            }`}
            onClick={() => setIsListening(!isListening)}
          >
            <div className="relative">
              <Mic size={40} className={isListening ? "text-white animate-pulse" : "text-white"} />
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/70"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0, 1],
                    }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="absolute -inset-3 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 5px 2px rgba(255,255,255,0.3)",
                        "0 0 15px 5px rgba(255,255,255,0.5)",
                        "0 0 5px 2px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  />
                </>
              )}
            </div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-slate-400">
            {isListening ? "Listening... Try saying 'Turn on the lights'" : "Click the microphone to start"}
          </p>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="flex flex-col items-center">
          <p className="text-slate-400 mb-2">Scroll to learn more</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-slate-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

