"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Lightbulb, Thermometer, Lock, Speaker, Volume2, Wifi, Bluetooth, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DemoPage() {
  const [isListening, setIsListening] = useState(false)
  const [currentCommand, setCurrentCommand] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("connected")
  const [deviceStates, setDeviceStates] = useState({
    lights: { power: false, brightness: 80, room: "Living Room" },
    thermostat: { temperature: 72, mode: "cool", target: 72 },
    door: { locked: true, status: "secure" },
    music: { playing: false, volume: 65, track: "None" },
    security: { armed: true, status: "all clear" },
  })

  const [voiceCommands] = useState([
    {
      command: "Turn on the living room lights",
      response: "Living room lights are now on",
      action: () =>
        setDeviceStates((prev) => ({
          ...prev,
          lights: { ...prev.lights, power: true },
        })),
    },
    {
      command: "Set temperature to 75 degrees",
      response: "Temperature set to 75°F",
      action: () =>
        setDeviceStates((prev) => ({
          ...prev,
          thermostat: { ...prev.thermostat, target: 75, temperature: 75 },
        })),
    },
    {
      command: "Play my relaxing playlist",
      response: "Playing your relaxing playlist",
      action: () =>
        setDeviceStates((prev) => ({
          ...prev,
          music: { ...prev.music, playing: true, track: "Relaxing Playlist" },
        })),
    },
    {
      command: "Lock all doors",
      response: "All doors are now locked and secure",
      action: () =>
        setDeviceStates((prev) => ({
          ...prev,
          door: { ...prev.door, locked: true, status: "secure" },
        })),
    },
    {
      command: "Good night",
      response: "Good night! I've turned off the lights, locked the doors, and set the alarm.",
      action: () =>
        setDeviceStates((prev) => ({
          ...prev,
          lights: { ...prev.lights, power: false },
          door: { ...prev.door, locked: true },
          security: { ...prev.security, armed: true },
        })),
    },
  ])

  const handleVoiceCommand = (commandObj) => {
    setCurrentCommand(commandObj.command)
    setIsListening(true)
    setIsProcessing(true)

    // Simulate voice processing
    setTimeout(() => {
      setIsProcessing(false)
      commandObj.action()

      // Show response
      setTimeout(() => {
        setIsListening(false)
        setCurrentCommand("")
      }, 2000)
    }, 1500)
  }

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true)
      setCurrentCommand("Listening for your command...")

      // Simulate listening timeout
      setTimeout(() => {
        if (currentCommand === "Listening for your command...") {
          setIsListening(false)
          setCurrentCommand("")
        }
      }, 5000)
    } else {
      setIsListening(false)
      setCurrentCommand("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Live Demo - Voice Assistant</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the power of voice-controlled smart home automation. Try the commands below or use the microphone
            to speak naturally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Voice Interface */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-blue-400" />
                    Voice Control Center
                  </span>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-400" />
                    <Bluetooth className="h-4 w-4 text-blue-400" />
                    <Badge variant="outline" className="border-green-400 text-green-400">
                      {connectionStatus}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Voice Button */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <motion.button
                      className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-300 ${
                        isListening
                          ? "bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/30"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"
                      }`}
                      onClick={toggleListening}
                      animate={isListening ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                      transition={{ repeat: isListening ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
                    >
                      {isListening ? <Mic className="h-12 w-12" /> : <MicOff className="h-12 w-12" />}
                    </motion.button>

                    {isListening && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-300/50"
                        animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-lg font-medium">{isListening ? "Listening..." : "Ready to Assist"}</p>
                    {currentCommand && (
                      <div className="p-3 bg-slate-700/50 rounded-lg">
                        <p className="text-sm text-blue-300">
                          {isProcessing ? "Processing: " : "You said: "}"{currentCommand}"
                        </p>
                        {isProcessing && <Progress value={75} className="mt-2 h-1" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Commands */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-300">Try These Commands:</h4>
                  <div className="grid gap-2">
                    {voiceCommands.map((cmd, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start text-left h-auto p-3 bg-slate-700/30 border-slate-600 hover:bg-slate-600/50 text-white"
                        onClick={() => handleVoiceCommand(cmd)}
                        disabled={isListening}
                      >
                        <Volume2 className="h-4 w-4 mr-3 text-blue-400" />
                        <span>"{cmd.command}"</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Device Status */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle>Smart Home Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lights */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lightbulb
                      className={`h-6 w-6 ${deviceStates.lights.power ? "text-yellow-400" : "text-slate-500"}`}
                    />
                    <div>
                      <p className="font-medium">{deviceStates.lights.room} Lights</p>
                      <p className="text-sm text-slate-400">Brightness: {deviceStates.lights.brightness}%</p>
                    </div>
                  </div>
                  <Badge variant={deviceStates.lights.power ? "default" : "secondary"}>
                    {deviceStates.lights.power ? "ON" : "OFF"}
                  </Badge>
                </div>

                {/* Thermostat */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-6 w-6 text-blue-400" />
                    <div>
                      <p className="font-medium">Thermostat</p>
                      <p className="text-sm text-slate-400">Mode: {deviceStates.thermostat.mode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{deviceStates.thermostat.temperature}°F</p>
                    <p className="text-sm text-slate-400">Target: {deviceStates.thermostat.target}°F</p>
                  </div>
                </div>

                {/* Door Lock */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className={`h-6 w-6 ${deviceStates.door.locked ? "text-green-400" : "text-red-400"}`} />
                    <div>
                      <p className="font-medium">Front Door</p>
                      <p className="text-sm text-slate-400">Status: {deviceStates.door.status}</p>
                    </div>
                  </div>
                  <Badge variant={deviceStates.door.locked ? "default" : "destructive"}>
                    {deviceStates.door.locked ? "LOCKED" : "UNLOCKED"}
                  </Badge>
                </div>

                {/* Music System */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Speaker
                      className={`h-6 w-6 ${deviceStates.music.playing ? "text-purple-400" : "text-slate-500"}`}
                    />
                    <div>
                      <p className="font-medium">Music System</p>
                      <p className="text-sm text-slate-400">
                        {deviceStates.music.playing ? deviceStates.music.track : "Not playing"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {deviceStates.music.playing && (
                      <span className="text-sm text-slate-400">Vol: {deviceStates.music.volume}%</span>
                    )}
                    <Badge variant={deviceStates.music.playing ? "default" : "secondary"}>
                      {deviceStates.music.playing ? "PLAYING" : "STOPPED"}
                    </Badge>
                  </div>
                </div>

                {/* Security System */}
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <div>
                      <p className="font-medium">Security System</p>
                      <p className="text-sm text-slate-400">Status: {deviceStates.security.status}</p>
                    </div>
                  </div>
                  <Badge variant={deviceStates.security.armed ? "default" : "secondary"}>
                    {deviceStates.security.armed ? "ARMED" : "DISARMED"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Card className="bg-slate-800/30 backdrop-blur-md border-slate-700 max-w-md mx-auto">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Wi-Fi Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bluetooth className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">Bluetooth Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm">24 Devices Connected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
