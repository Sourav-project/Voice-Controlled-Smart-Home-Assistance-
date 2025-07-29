"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Brain, Heart, Moon, Coffee, Car } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PersonalizationPanelProps {
  activeUser: string
  currentMood: string
}

export default function PersonalizationPanel({ activeUser, currentMood }: PersonalizationPanelProps) {
  const [learningProgress, setLearningProgress] = useState(78)

  const userProfile = {
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    preferences: {
      wakeUpTime: "7:00 AM",
      bedTime: "11:00 PM",
      favoriteMusic: "Jazz & Classical",
      preferredTemp: "72°F",
      lightingStyle: "Warm & Dim",
    },
    habits: [
      { activity: "Morning Coffee", time: "7:15 AM", confidence: 95 },
      { activity: "Leave for Work", time: "8:30 AM", confidence: 88 },
      { activity: "Evening Movie", time: "8:00 PM", confidence: 72 },
      { activity: "Bedtime Routine", time: "10:45 PM", confidence: 91 },
    ],
    moodHistory: [
      { mood: "energetic", time: "Morning", color: "bg-yellow-400" },
      { mood: "focused", time: "Afternoon", color: "bg-blue-400" },
      { mood: "relaxed", time: "Evening", color: "bg-green-400" },
    ],
  }

  const predictiveActions = [
    {
      title: "Coffee Ready",
      description: "Your coffee will be ready at 7:15 AM tomorrow",
      icon: <Coffee className="h-4 w-4" />,
      confidence: 95,
      color: "text-amber-500",
    },
    {
      title: "Pre-heat Car",
      description: "Car will start warming up at 8:20 AM",
      icon: <Car className="h-4 w-4" />,
      confidence: 88,
      color: "text-blue-500",
    },
    {
      title: "Movie Ambiance",
      description: "Lights will dim automatically at 8 PM",
      icon: <Moon className="h-4 w-4" />,
      confidence: 72,
      color: "text-purple-500",
    },
  ]

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Personalization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{userProfile.name}</h4>
            <p className="text-sm text-slate-500">Voice Profile: Verified</p>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Learning Progress</span>
            <span className="text-sm text-slate-500">{learningProgress}%</span>
          </div>
          <Progress value={learningProgress} className="h-2" />
          <p className="text-xs text-slate-500">AI is learning your preferences and habits</p>
        </div>

        {/* Current Mood */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Detected Mood</h4>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <Badge variant="outline" className="capitalize">
              {currentMood}
            </Badge>
          </div>
          <div className="flex gap-1">
            {userProfile.moodHistory.map((mood, index) => (
              <div key={index} className="flex-1 text-center">
                <div className={`h-2 rounded-full ${mood.color} mb-1`} />
                <p className="text-xs text-slate-500">{mood.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learned Habits */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Learned Habits</h4>
          <div className="space-y-2">
            {userProfile.habits.map((habit, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{habit.activity}</p>
                  <p className="text-xs text-slate-500">{habit.time}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {habit.confidence}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Upcoming Predictions</h4>
          <div className="space-y-2">
            {predictiveActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg"
              >
                <div className={`p-1 rounded ${action.color}`}>{action.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${action.confidence}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{action.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <div className="pt-4 border-t border-slate-200">
          <Button variant="outline" className="w-full bg-transparent" size="sm">
            <User className="h-4 w-4 mr-2" />
            Customize Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
