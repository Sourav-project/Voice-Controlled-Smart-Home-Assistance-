"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Lock, Camera, AlertTriangle, CheckCircle, Eye, Mic, Fingerprint, Key } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export default function SecurityOverview() {
  const [securityStatus, setSecurityStatus] = useState("armed")
  const [voiceBiometrics, setVoiceBiometrics] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)

  const securityDevices = [
    {
      name: "Front Door Camera",
      status: "active",
      lastActivity: "2 min ago",
      icon: <Camera className="h-4 w-4" />,
      color: "text-green-500",
    },
    {
      name: "Motion Sensors",
      status: "active",
      lastActivity: "5 min ago",
      icon: <Eye className="h-4 w-4" />,
      color: "text-blue-500",
    },
    {
      name: "Smart Locks",
      status: "locked",
      lastActivity: "1 hour ago",
      icon: <Lock className="h-4 w-4" />,
      color: "text-green-500",
    },
    {
      name: "Voice Authentication",
      status: voiceBiometrics ? "enabled" : "disabled",
      lastActivity: "Active",
      icon: <Fingerprint className="h-4 w-4" />,
      color: voiceBiometrics ? "text-green-500" : "text-slate-400",
    },
  ]

  const recentAlerts = [
    {
      type: "info",
      message: "Front door unlocked by John Doe",
      time: "2 hours ago",
      icon: <Key className="h-4 w-4 text-blue-500" />,
    },
    {
      type: "warning",
      message: "Unusual sound detected in kitchen",
      time: "Yesterday",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    },
    {
      type: "success",
      message: "Security system armed successfully",
      time: "Yesterday",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    },
  ]

  const privacyControls = [
    {
      name: "Voice Recording",
      description: "Store voice commands for improvement",
      enabled: !privacyMode,
      icon: <Mic className="h-4 w-4" />,
    },
    {
      name: "Activity Logging",
      description: "Log device interactions and patterns",
      enabled: true,
      icon: <Eye className="h-4 w-4" />,
    },
    {
      name: "Data Encryption",
      description: "End-to-end encryption for all communications",
      enabled: true,
      icon: <Shield className="h-4 w-4" />,
    },
  ]

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Security & Privacy
          </span>
          <Badge variant={securityStatus === "armed" ? "default" : "secondary"}>{securityStatus}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Status */}
        <div className="grid grid-cols-2 gap-4">
          {securityDevices.map((device, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={device.color}>{device.icon}</div>
                <span className="text-sm font-medium">{device.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    device.status === "active" || device.status === "locked" || device.status === "enabled"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {device.status}
                </Badge>
                <span className="text-xs text-slate-500">{device.lastActivity}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Voice Biometrics */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Voice Biometrics</h4>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Voice Authentication</p>
                <p className="text-xs text-slate-500">Secure access using voice patterns</p>
              </div>
            </div>
            <Switch checked={voiceBiometrics} onCheckedChange={setVoiceBiometrics} />
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Privacy Controls</h4>
            <Button variant="outline" size="sm" onClick={() => setPrivacyMode(!privacyMode)}>
              {privacyMode ? "Exit" : "Enter"} Privacy Mode
            </Button>
          </div>
          <div className="space-y-2">
            {privacyControls.map((control, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="text-slate-600">{control.icon}</div>
                  <div>
                    <p className="text-sm font-medium">{control.name}</p>
                    <p className="text-xs text-slate-500">{control.description}</p>
                  </div>
                </div>
                <Switch
                  checked={control.enabled && !privacyMode}
                  disabled={privacyMode && control.name === "Voice Recording"}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recent Activity</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                {alert.icon}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-slate-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
