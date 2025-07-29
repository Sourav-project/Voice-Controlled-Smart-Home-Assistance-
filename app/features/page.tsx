"use client"

import { motion } from "framer-motion"
import {
  Brain,
  MessageSquare,
  Eye,
  Heart,
  Shield,
  Smartphone,
  Mic,
  Globe,
  Zap,
  Home,
  Car,
  ChefHat,
  Music,
  Camera,
  Lock,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function FeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [expandedCategory, setExpandedCategory] = useState(null)

  const featureCategories = [
    {
      title: "Enhanced Intelligence & Personalization",
      icon: <Brain className="h-6 w-6" />,
      color: "text-purple-500",
      features: [
        {
          name: "Advanced Natural Language Processing",
          description: "Conversational AI that understands context and remembers previous interactions",
          icon: <MessageSquare className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Contextual Understanding",
          description: "Understands location-based commands like 'turn on the lights in here'",
          icon: <Eye className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Predictive Automation",
          description: "Learns daily routines and proactively adjusts settings",
          icon: <Zap className="h-5 w-5" />,
          status: "Learning",
        },
        {
          name: "Emotion Detection",
          description: "Analyzes voice tone to detect emotions and adapt environment",
          icon: <Heart className="h-5 w-5" />,
          status: "Active",
        },
      ],
    },
    {
      title: "Advanced Interaction & Feedback",
      icon: <Smartphone className="h-6 w-6" />,
      color: "text-blue-500",
      features: [
        {
          name: "Multi-Modal Interaction",
          description: "Visual feedback, gestural control, and haptic responses",
          icon: <Eye className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Speaker Recognition",
          description: "Voice biometrics for user-specific profiles and secure authentication",
          icon: <Mic className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Edge Computing",
          description: "Local processing for improved speed, privacy, and offline functionality",
          icon: <Zap className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Multi-Language Support",
          description: "Support for various languages and regional dialects",
          icon: <Globe className="h-5 w-5" />,
          status: "Available",
        },
      ],
    },
    {
      title: "Integration & Connectivity",
      icon: <Home className="h-6 w-6" />,
      color: "text-green-500",
      features: [
        {
          name: "Seamless IoT Integration",
          description: "Support for Zigbee, Z-Wave, Matter, Wi-Fi, and Bluetooth devices",
          icon: <Home className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Health & Wellness Integration",
          description: "Vital sign monitoring, medication reminders, and emergency assistance",
          icon: <Activity className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Vehicle Integration",
          description: "Car-to-home control and remote vehicle management",
          icon: <Car className="h-5 w-5" />,
          status: "Beta",
        },
        {
          name: "Robotics Integration",
          description: "Control home robots and companion devices",
          icon: <Zap className="h-5 w-5" />,
          status: "Coming Soon",
        },
      ],
    },
    {
      title: "Security & Privacy",
      icon: <Shield className="h-6 w-6" />,
      color: "text-red-500",
      features: [
        {
          name: "End-to-End Encryption",
          description: "Secure communication between all devices and cloud services",
          icon: <Shield className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Granular Privacy Controls",
          description: "Data retention management and opt-out options",
          icon: <Lock className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Intrusion Detection",
          description: "Voice-activated security and anomalous sound detection",
          icon: <Camera className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Voice Biometrics",
          description: "Secure authentication using unique voice patterns",
          icon: <Mic className="h-5 w-5" />,
          status: "Active",
        },
      ],
    },
    {
      title: "Lifestyle & Utilities",
      icon: <Music className="h-6 w-6" />,
      color: "text-orange-500",
      features: [
        {
          name: "Entertainment Control",
          description: "Contextual music playback and multi-room audio control",
          icon: <Music className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Kitchen Assistant",
          description: "Recipe guidance, cooking timers, and smart appliance control",
          icon: <ChefHat className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Remote Monitoring",
          description: "Control devices remotely and receive activity notifications",
          icon: <Smartphone className="h-5 w-5" />,
          status: "Active",
        },
        {
          name: "Accessibility Features",
          description: "Text-to-speech, visual assistance, and enhanced voice controls",
          icon: <Eye className="h-5 w-5" />,
          status: "Active",
        },
      ],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Learning":
        return "bg-blue-500"
      case "Beta":
        return "bg-yellow-500"
      case "Available":
        return "bg-purple-500"
      case "Coming Soon":
        return "bg-slate-400"
      default:
        return "bg-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Advanced Features</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the comprehensive capabilities of our Voice-Controlled Smart Home Assistant
          </p>
        </motion.div>

        <div className="space-y-12">
          {featureCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg bg-white shadow-sm ${category.color}`}>{category.icon}</div>
                <h2 className="text-2xl font-bold text-slate-800">{category.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 + featureIndex * 0.05 }}
                    onClick={() => setSelectedFeature(feature)}
                    className="cursor-pointer"
                  >
                    <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">{feature.icon}</div>
                            <h3 className="font-semibold text-slate-800">{feature.name}</h3>
                          </div>
                          <Badge className={`${getStatusColor(feature.status)} text-white`}>{feature.status}</Badge>
                        </div>
                        <p className="text-slate-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedFeature.name}
                <Button variant="ghost" onClick={() => setSelectedFeature(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{selectedFeature.description}</p>
              <Badge className={`${getStatusColor(selectedFeature.status)} text-white`}>{selectedFeature.status}</Badge>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
