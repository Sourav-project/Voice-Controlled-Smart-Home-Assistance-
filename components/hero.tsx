"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Smartphone, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { speechRecognition } from "@/lib/speech-recognition"
import { voiceCommandProcessor } from "@/lib/connectivity"
import MicrophonePermissionGuide from "@/components/microphone-permission-guide"

export default function Hero() {
  const [isListening, setIsListening] = useState(false)
  const [currentCommand, setCurrentCommand] = useState("")
  const [response, setResponse] = useState("")
  const [capabilities, setCapabilities] = useState<any>(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [showPermissionGuide, setShowPermissionGuide] = useState(false)

  useEffect(() => {
    if (speechRecognition) {
      setCapabilities(speechRecognition.getCapabilities())
    }
  }, [])

  useEffect(() => {
    const checkInitialPermissions = async () => {
      if (speechRecognition && navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName })
          setPermissionGranted(permissionStatus.state === "granted")

          // Listen for permission changes
          permissionStatus.onchange = () => {
            setPermissionGranted(permissionStatus.state === "granted")
          }
        } catch (error) {
          console.log("Could not check microphone permissions")
        }
      }
    }

    checkInitialPermissions()
  }, [])

  const handleVoiceActivation = async () => {
    if (!speechRecognition) {
      setResponse("❌ Speech recognition not available on this device")
      return
    }

    if (isListening) {
      speechRecognition.stopListening()
      setIsListening(false)
      setCurrentCommand("")
      return
    }

    try {
      setIsListening(true)
      setCurrentCommand("🎤 Listening...")
      setResponse("")

      const result = await speechRecognition.startListening()
      setPermissionGranted(true)
      setCurrentCommand(result.transcript)

      if (voiceCommandProcessor && result.transcript.trim()) {
        const commandResponse = await voiceCommandProcessor.processCommand(result.transcript)
        setResponse(commandResponse.message)

        // Speak the response
        if (commandResponse.success) {
          try {
            await speechRecognition.speak(commandResponse.message)
          } catch (error) {
            console.log("Text-to-speech failed:", error)
          }
        }
      }

      // Clear after 5 seconds
      setTimeout(() => {
        setCurrentCommand("")
        setResponse("")
      }, 5000)
    } catch (error: any) {
      console.error("Voice command error:", error)
      setCurrentCommand("")

      // Show permission guide for permission errors
      if (
        error.message.includes("permission") ||
        error.message.includes("denied") ||
        error.message.includes("not-allowed")
      ) {
        setShowPermissionGuide(true)
      }

      // Use the error message from the speech recognition system
      setResponse(error.message || "❌ Voice recognition failed. Please try again.")

      setTimeout(() => setResponse(""), 6000)
    } finally {
      setIsListening(false)
    }
  }

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
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

      <div className="z-10 text-center px-8 py-12 w-full rounded-2xl bg-white/20 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)] relative overflow-hidden">
        {/* Device compatibility indicator */}
        <div className="absolute top-4 right-4 flex gap-2">
          {capabilities?.isMobile && (
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
              <Smartphone className="h-3 w-3 mr-1" />
              Mobile Ready
            </Badge>
          )}
          {!capabilities?.isMobile && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400">
              <Monitor className="h-3 w-3 mr-1" />
              Desktop Ready
            </Badge>
          )}
          {capabilities?.speechRecognition && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-400">
              🎤 Voice Ready
            </Badge>
          )}
        </div>

        {/* Animated subtle background patterns */}
        <div className="absolute inset-0 z-0 opacity-20">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
            animate={{
              x: [50, 0, 50],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [50, 0, 50],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 [text-shadow:_0_0_15px_rgba(255,255,255,0.5),_0_0_30px_rgba(59,130,246,0.5),_0_0_5px_#fff] relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          Voice-Controlled Smart Home Assistant
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 text-slate-300 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
        >
          Real voice recognition for smartphones and computers. Control your smart home naturally.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 relative z-10"
        >
          {/* Siri-like colorful background effect */}
          {isListening && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 blur-md"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 360],
                background: [
                  "linear-gradient(90deg, rgba(59,130,246,0.7) 0%, rgba(147,51,234,0.7) 50%, rgba(236,72,153,0.7) 100%)",
                  "linear-gradient(180deg, rgba(6,182,212,0.7) 0%, rgba(59,130,246,0.7) 50%, rgba(147,51,234,0.7) 100%)",
                  "linear-gradient(270deg, rgba(236,72,153,0.7) 0%, rgba(6,182,212,0.7) 50%, rgba(59,130,246,0.7) 100%)",
                  "linear-gradient(90deg, rgba(59,130,246,0.7) 0%, rgba(147,51,234,0.7) 50%, rgba(236,72,153,0.7) 100%)",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          )}

          <Button
            size="lg"
            className={`rounded-full h-24 w-24 p-0 relative z-10 transition-all duration-300 ${
              isListening
                ? "bg-red-500/80 backdrop-blur-md border-2 border-white/30 shadow-lg shadow-red-500/50"
                : capabilities?.speechRecognition
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                  : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={handleVoiceActivation}
            disabled={!capabilities?.speechRecognition}
          >
            <div className="relative">
              {isListening ? (
                <Mic size={40} className="text-white animate-pulse" />
              ) : capabilities?.speechRecognition ? (
                <Mic size={40} className="text-white" />
              ) : (
                <MicOff size={40} className="text-white" />
              )}

              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/70"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [1, 0, 1],
                    }}
                    transition={{ duration: 1.8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="absolute -inset-3 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 5px 2px rgba(255,255,255,0.3)",
                        "0 0 25px 8px rgba(255,255,255,0.6)",
                        "0 0 5px 2px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
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
          className="relative z-10 space-y-3"
        >
          {currentCommand ? (
            <div className="space-y-2">
              <p className="text-lg text-blue-300 font-medium">"{currentCommand}"</p>
              {response && (
                <p
                  className={`text-lg font-medium ${response.includes("❌") || response.includes("🚫") ? "text-red-300" : "text-green-300"}`}
                >
                  {response}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg text-slate-300">
                {capabilities?.speechRecognition
                  ? "🎤 Click the microphone to start voice control"
                  : "Voice recognition not available on this device"}
              </p>
              {capabilities?.speechRecognition && (
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Try saying:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="bg-white/10 text-slate-300 border-slate-500">
                      "Turn on the lights"
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-slate-300 border-slate-500">
                      "Set temperature to 72"
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-slate-300 border-slate-500">
                      "Good night"
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Permission status */}
        {capabilities?.speechRecognition && !permissionGranted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 text-sm text-yellow-300"
          >
            🔐 Microphone permission required for voice control
          </motion.div>
        )}

        {/* Permission Guide Modal */}
        <MicrophonePermissionGuide
          isOpen={showPermissionGuide}
          onClose={() => setShowPermissionGuide(false)}
          isMobile={capabilities?.isMobile || false}
        />
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
