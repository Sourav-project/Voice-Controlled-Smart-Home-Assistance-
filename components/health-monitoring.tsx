"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Activity, Moon, Thermometer, AlertCircle, TrendingUp, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function HealthMonitoring() {
  const [healthScore, setHealthScore] = useState(92)

  const healthMetrics = [
    {
      name: "Sleep Quality",
      value: 85,
      unit: "%",
      status: "good",
      icon: <Moon className="h-4 w-4" />,
      color: "text-blue-500",
      trend: "+5% from last week",
    },
    {
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      status: "normal",
      icon: <Heart className="h-4 w-4" />,
      color: "text-red-500",
      trend: "Resting rate",
    },
    {
      name: "Activity Level",
      value: 78,
      unit: "%",
      status: "active",
      icon: <Activity className="h-4 w-4" />,
      color: "text-green-500",
      trend: "Daily goal: 80%",
    },
    {
      name: "Room Temperature",
      value: 72,
      unit: "°F",
      status: "optimal",
      icon: <Thermometer className="h-4 w-4" />,
      color: "text-orange-500",
      trend: "Comfort zone",
    },
  ]

  const wellnessInsights = [
    {
      type: "recommendation",
      title: "Sleep Schedule",
      message: "Consider going to bed 30 minutes earlier for better sleep quality",
      priority: "medium",
      icon: <Moon className="h-4 w-4 text-blue-500" />,
    },
    {
      type: "alert",
      title: "Stress Detection",
      message: "Elevated stress detected in voice patterns. Relaxation mode activated",
      priority: "high",
      icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    },
    {
      type: "achievement",
      title: "Activity Goal",
      message: "You've reached 78% of your daily activity goal!",
      priority: "low",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
  ]

  const emergencyFeatures = [
    {
      name: "Fall Detection",
      status: "active",
      description: "Monitors for unusual movement patterns",
    },
    {
      name: "Voice Stress Analysis",
      status: "active",
      description: "Detects distress in voice commands",
    },
    {
      name: "Emergency Contacts",
      status: "configured",
      description: "3 contacts ready for alerts",
    },
  ]

  const medicationReminders = [
    {
      medication: "Vitamin D",
      time: "8:00 AM",
      status: "taken",
      nextDue: "Tomorrow",
    },
    {
      medication: "Blood Pressure",
      time: "6:00 PM",
      status: "pending",
      nextDue: "In 2 hours",
    },
  ]

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Health & Wellness
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Health Score:</span>
            <Badge variant="default" className="bg-green-500">
              {healthScore}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={metric.color}>{metric.icon}</div>
                <span className="text-sm font-medium">{metric.name}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold">{metric.value}</span>
                  <span className="text-xs text-slate-500">{metric.unit}</span>
                </div>
                <p className="text-xs text-slate-500">{metric.trend}</p>
                <Badge
                  variant={
                    metric.status === "good" || metric.status === "normal" || metric.status === "optimal"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {metric.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wellness Insights */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Wellness Insights</h4>
          <div className="space-y-2">
            {wellnessInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  insight.priority === "high"
                    ? "border-red-400 bg-red-50"
                    : insight.priority === "medium"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-green-400 bg-green-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  {insight.icon}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-slate-600">{insight.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Medication Reminders */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Medication Reminders</h4>
          <div className="space-y-2">
            {medicationReminders.map((med, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{med.medication}</p>
                    <p className="text-xs text-slate-500">
                      {med.time} • {med.nextDue}
                    </p>
                  </div>
                </div>
                <Badge variant={med.status === "taken" ? "default" : "outline"}>{med.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Features */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Emergency Features</h4>
          <div className="space-y-2">
            {emergencyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{feature.name}</p>
                    <p className="text-xs text-slate-500">{feature.description}</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-500">
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              View Trends
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Health Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
