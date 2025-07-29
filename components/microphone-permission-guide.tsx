"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  Chrome,
  ChromeIcon as Firefox,
  AppleIcon as Safari,
  Smartphone,
  Monitor,
  X,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MicrophonePermissionGuideProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export default function MicrophonePermissionGuide({ isOpen, onClose, isMobile }: MicrophonePermissionGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const desktopSteps = [
    {
      title: "Click the Microphone Icon",
      description: "Look for the microphone icon in your browser's address bar",
      icon: <Mic className="h-8 w-8 text-blue-500" />,
      image: "🎤",
    },
    {
      title: "Allow Microphone Access",
      description: "Click 'Allow' when prompted to grant microphone permission",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      image: "✅",
    },
    {
      title: "Start Voice Control",
      description: "Click the voice button and start speaking naturally",
      icon: <Mic className="h-8 w-8 text-purple-500" />,
      image: "🗣️",
    },
  ]

  const mobileSteps = [
    {
      title: "Tap the Microphone Button",
      description: "Tap the large microphone button on the page",
      icon: <Smartphone className="h-8 w-8 text-blue-500" />,
      image: "📱",
    },
    {
      title: "Allow Microphone Access",
      description: "Tap 'Allow' when your browser asks for microphone permission",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      image: "✅",
    },
    {
      title: "Speak Clearly",
      description: "Speak clearly within 10 seconds. Use headphones for better results",
      icon: <Mic className="h-8 w-8 text-purple-500" />,
      image: "🎧",
    },
  ]

  const steps = isMobile ? mobileSteps : desktopSteps

  const browserTips = [
    {
      name: "Chrome",
      icon: <Chrome className="h-5 w-5" />,
      tip: "Click the microphone icon in the address bar, then 'Allow'",
    },
    {
      name: "Safari",
      icon: <Safari className="h-5 w-5" />,
      tip: "Look for the microphone icon next to the address bar",
    },
    {
      name: "Firefox",
      icon: <Firefox className="h-5 w-5" />,
      tip: "Click the shield icon, then allow microphone access",
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {isMobile ? (
                      <Smartphone className="h-6 w-6 text-blue-500" />
                    ) : (
                      <Monitor className="h-6 w-6 text-blue-500" />
                    )}
                    <CardTitle>Enable Microphone Access</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-slate-600">
                  Follow these steps to enable voice control on your {isMobile ? "mobile device" : "computer"}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Steps */}
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors ${
                        currentStep === index ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <span className="text-2xl">{step.image}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-slate-600 text-sm">{step.description}</p>
                      </div>
                      {step.icon}
                    </motion.div>
                  ))}
                </div>

                {/* Browser-specific tips */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800">Browser-Specific Tips:</h4>
                  <div className="grid gap-3">
                    {browserTips.map((browser, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        {browser.icon}
                        <div>
                          <p className="font-medium text-sm">{browser.name}</p>
                          <p className="text-xs text-slate-600">{browser.tip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Troubleshooting */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Still having issues?</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Make sure you're using HTTPS or localhost</li>
                    <li>• Check if your microphone is connected and working</li>
                    <li>• Try refreshing the page and allowing permissions again</li>
                    <li>• Ensure no other apps are using your microphone</li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={onClose} className="flex-1">
                    Got it, let's try again
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}>
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
