"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Brain, Zap, MessageSquare, Eye, Heart, Smartphone, Monitor, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { speechRecognition } from "@/lib/speech-recognition"
import { voiceCommandProcessor } from "@/lib/connectivity"

interface VoiceCommandCenterProps {
  isListening: boolean
  setIsListening: (listening: boolean) => void
  currentMood: string
  setCurrentMood: (mood: string) => void
}

export default function VoiceCommandCenter({
  isListening,
  setIsListening,
  currentMood,
  setCurrentMood,
}: VoiceCommandCenterProps) {
  const [currentCommand, setCurrentCommand] = useState("")
  const [interimCommand, setInterimCommand] = useState("")
  const [voiceConfidence, setVoiceConfidence] = useState(0)
  const [contextAwareness, setContextAwareness] = useState("Living Room")
  const [emotionDetected, setEmotionDetected] = useState("neutral")
  const [capabilities, setCapabilities] = useState<any>(null)
  const [permissionStatus, setPermissionStatus] = useState<string>("unknown")
  const [conversationHistory, setConversationHistory] = useState([
    { user: "Turn on the living room lights", assistant: "Living room lights are now on", time: "2 min ago" },
    {
      user: "What's the temperature?",
      assistant: "It's currently 72°F. Would you like me to adjust it?",
      time: "5 min ago",
    },
  ])

  useEffect(() => {
    if (speechRecognition) {
      setCapabilities(speechRecognition.getCapabilities())
    }
  }, [])

  const handleVoiceActivation = async () => {
    if (!speechRecognition) {
      alert("❌ Speech recognition not available on this device")
      return
    }

    if (isListening) {
      speechRecognition.stopListening()
      setIsListening(false)
      setCurrentCommand("")
      setInterimCommand("")
      return
    }

    try {
      setIsListening(true)
      setCurrentCommand("")
      setInterimCommand("")
      setPermissionStatus("requesting")

      const result = await speechRecognition.startListening()

      setVoiceConfidence(Math.round(result.confidence * 100))
      setCurrentCommand(result.transcript)
      setPermissionStatus("granted")

      // Process the command
      if (voiceCommandProcessor && result.transcript.trim()) {
        const response = await voiceCommandProcessor.processCommand(result.transcript)

        // Add to conversation history
        setConversationHistory((prev) => [
          {
            user: result.transcript,
            assistant: response.message,
            time: "now",
          },
          ...prev.slice(0, 4),
        ])

        // Speak the response
        if (response.success) {
          try {
            await speechRecognition.speak(response.message)
          } catch (error) {
            console.log("Text-to-speech failed:", error)
          }
        }

        // Simulate emotion detection based on command
        const emotions = ["happy", "relaxed", "focused", "excited"]
        setEmotionDetected(emotions[Math.floor(Math.random() * emotions.length)])
      }
    } catch (error: any) {
      console.error("Voice recognition error:", error)
      setPermissionStatus("denied")

      // Use the detailed error message from speech recognition
      const errorMessage = error.message || "Voice recognition failed. Please try again."

      setConversationHistory((prev) => [
        {
          user: "Voice command failed",
          assistant: errorMessage,
          time: "now",
        },
        ...prev.slice(0, 4),
      ])
    } finally {
      setIsListening(false)
    }
  }

  const predefinedCommands = [
    { text: "Turn on the lights", category: "Lighting", icon: "💡" },
    { text: "Set temperature to 72 degrees", category: "Climate", icon: "🌡️" },
    { text: "Lock all doors", category: "Security", icon: "🔒" },
    { text: "Play relaxing music", category: "Entertainment", icon: "🎵" },
    { text: "Good night", category: "Routine", icon: "🌙" },
    { text: "I'm home", category: "Routine", icon: "🏠" },
  ]

  const handlePredefinedCommand = async (commandText: string) => {
    if (!voiceCommandProcessor) return

    setCurrentCommand(commandText)

    try {
      const response = await voiceCommandProcessor.processCommand(commandText)

      setConversationHistory((prev) => [
        {
          user: commandText,
          assistant: response.message,
          time: "now",
        },
        ...prev.slice(0, 4),
      ])

      // Speak the response
      if (speechRecognition && response.success) {
        try {
          await speechRecognition.speak(response.message)
        } catch (error) {
          console.log("Text-to-speech failed:", error)
        }
      }
    } catch (error) {
      console.error("Command processing failed:", error)
    }
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          Real Voice Command Center
          {capabilities?.isMobile && <Smartphone className="h-4 w-4 text-green-500" />}
          {!capabilities?.isMobile && <Monitor className="h-4 w-4 text-blue-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capability Status */}
        {capabilities && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="text-center">
              <Badge variant={capabilities.speechRecognition ? "default" : "secondary"}>
                {capabilities.speechRecognition ? "✓ Speech" : "✗ Speech"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={capabilities.speechSynthesis ? "default" : "secondary"}>
                {capabilities.speechSynthesis ? "✓ Voice" : "✗ Voice"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={capabilities.isMobile ? "outline" : "default"}>
                {capabilities.isMobile ? "📱 Mobile" : "💻 Desktop"}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={permissionStatus === "granted" ? "default" : "secondary"}>
                {permissionStatus === "granted" ? "✓ Mic" : "? Mic"}
              </Badge>
            </div>
          </div>
        )}

        {/* Permission Alert */}
        {permissionStatus === "denied" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Microphone access is required for voice commands. Please allow microphone access in your browser settings
              and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Voice Interface */}
        <div className="text-center space-y-4">
          <div className="relative">
            <motion.div
              className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                isListening
                  ? "bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/30"
                  : capabilities?.speechRecognition
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"
                    : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleVoiceActivation}
              animate={isListening ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: isListening ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
              disabled={!capabilities?.speechRecognition}
            >
              {isListening ? (
                <Mic className="h-8 w-8 text-white animate-pulse" />
              ) : (
                <MicOff className="h-8 w-8 text-white" />
              )}
            </motion.div>

            {isListening && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-300"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isListening
                ? "🎤 Listening..."
                : capabilities?.speechRecognition
                  ? "Ready to assist"
                  : "Voice not available"}
            </p>
            {currentCommand && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">You said:</p>
                <p className="text-blue-900">"{currentCommand}"</p>
                {voiceConfidence > 0 && <p className="text-xs text-blue-600 mt-1">Confidence: {voiceConfidence}%</p>}
              </div>
            )}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <MessageSquare className="h-6 w-6 mx-auto text-blue-500" />
            <p className="text-xs font-medium">Real Speech</p>
            <Badge variant="secondary" className="text-xs">
              {capabilities?.speechRecognition ? "Active" : "Unavailable"}
            </Badge>
          </div>
          <div className="text-center space-y-2">
            <Eye className="h-6 w-6 mx-auto text-green-500" />
            <p className="text-xs font-medium">Context Aware</p>
            <Badge variant="secondary" className="text-xs">
              {contextAwareness}
            </Badge>
          </div>
          <div className="text-center space-y-2">
            <Heart className="h-6 w-6 mx-auto text-red-500" />
            <p className="text-xs font-medium">Emotion Detection</p>
            <Badge variant="secondary" className="text-xs">
              {emotionDetected}
            </Badge>
          </div>
          <div className="text-center space-y-2">
            <Zap className="h-6 w-6 mx-auto text-yellow-500" />
            <p className="text-xs font-medium">Voice Confidence</p>
            <Badge variant="secondary" className="text-xs">
              {voiceConfidence}%
            </Badge>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">Quick Commands</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {predefinedCommands.map((command, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3 bg-transparent hover:bg-slate-50"
                onClick={() => handlePredefinedCommand(command.text)}
                disabled={isListening}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{command.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{command.text}</p>
                    <p className="text-xs text-slate-500">{command.category}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700">Recent Conversations</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {conversationHistory.map((conv, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-3 space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-blue-600">You: {conv.user}</p>
                  <span className="text-xs text-slate-400">{conv.time}</span>
                </div>
                <p className="text-sm text-slate-600">Assistant: {conv.assistant}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions for mobile users */}
        {capabilities?.isMobile && (
          <div className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-700 mb-1">📱 Mobile Tips:</p>
            <ul className="space-y-1">
              <li>• Tap the microphone and speak clearly</li>
              <li>• Allow microphone access when prompted</li>
              <li>• Speak within 10 seconds of activation</li>
              <li>• Use headphones for better recognition</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
