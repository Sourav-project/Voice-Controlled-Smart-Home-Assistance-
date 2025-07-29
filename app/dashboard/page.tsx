"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, Heart, Shield, Users, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import VoiceCommandCenter from "@/components/voice-command-center"
import DeviceGrid from "@/components/device-grid"
import PersonalizationPanel from "@/components/personalization-panel"
import SecurityOverview from "@/components/security-overview"
import HealthMonitoring from "@/components/health-monitoring"
import ConnectivityStatus from "@/components/connectivity-status"

export default function Dashboard() {
  const [activeUser, setActiveUser] = useState("John Doe")
  const [isListening, setIsListening] = useState(false)
  const [currentMood, setCurrentMood] = useState("relaxed")
  const [energyUsage, setEnergyUsage] = useState(78)

  const quickStats = [
    { label: "Active Devices", value: "24", icon: <Home className="h-5 w-5" />, color: "text-blue-500" },
    { label: "Energy Saved", value: "23%", icon: <Zap className="h-5 w-5" />, color: "text-green-500" },
    { label: "Security Status", value: "Secure", icon: <Shield className="h-5 w-5" />, color: "text-emerald-500" },
    { label: "Health Score", value: "92", icon: <Heart className="h-5 w-5" />, color: "text-red-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Smart Home Dashboard</h1>
            <p className="text-slate-600">Welcome back, {activeUser}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              All Systems Online
            </Badge>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Switch User
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Command Center */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <VoiceCommandCenter
              isListening={isListening}
              setIsListening={setIsListening}
              currentMood={currentMood}
              setCurrentMood={setCurrentMood}
            />
          </motion.div>

          {/* Personalization Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <PersonalizationPanel activeUser={activeUser} currentMood={currentMood} />
          </motion.div>
        </div>

        {/* Device Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <DeviceGrid />
        </motion.div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Overview */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <SecurityOverview />
          </motion.div>

          {/* Health Monitoring */}
          <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <HealthMonitoring />
          </motion.div>

          {/* Connectivity Status */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <ConnectivityStatus />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
