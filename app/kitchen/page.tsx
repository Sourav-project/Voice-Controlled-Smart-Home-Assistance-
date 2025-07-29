"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChefHat, Thermometer, Coffee, Utensils, Timer, Volume2, Mic, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

export default function KitchenAssistant() {
  const [activeRecipe, setActiveRecipe] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [timers, setTimers] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [ovenTemp, setOvenTemp] = useState([350])
  const [coffeeMakerStatus, setCoffeeMakerStatus] = useState("ready")

  const recipes = [
    {
      id: 1,
      name: "Chocolate Chip Cookies",
      difficulty: "Easy",
      time: "25 min",
      servings: 24,
      steps: [
        "Preheat oven to 375°F",
        "Mix butter and sugars until creamy",
        "Beat in eggs and vanilla",
        "Gradually blend in flour mixture",
        "Stir in chocolate chips",
        "Drop rounded tablespoons onto ungreased cookie sheets",
        "Bake 9 to 11 minutes or until golden brown",
      ],
      ingredients: [
        "2¼ cups all-purpose flour",
        "1 tsp baking soda",
        "1 tsp salt",
        "1 cup butter, softened",
        "¾ cup granulated sugar",
        "¾ cup packed brown sugar",
        "2 large eggs",
        "2 tsp vanilla extract",
        "2 cups chocolate chips",
      ],
    },
    {
      id: 2,
      name: "Pasta Carbonara",
      difficulty: "Medium",
      time: "20 min",
      servings: 4,
      steps: [
        "Boil salted water for pasta",
        "Cook pancetta until crispy",
        "Whisk eggs with cheese and pepper",
        "Cook pasta until al dente",
        "Combine hot pasta with pancetta",
        "Remove from heat and add egg mixture",
        "Toss quickly to create creamy sauce",
      ],
      ingredients: [
        "400g spaghetti",
        "200g pancetta, diced",
        "4 large eggs",
        "100g Pecorino Romano, grated",
        "Black pepper to taste",
        "Salt for pasta water",
      ],
    },
  ]

  const smartAppliances = [
    {
      name: "Smart Oven",
      status: "preheating",
      temperature: ovenTemp[0],
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-orange-500",
    },
    {
      name: "Coffee Maker",
      status: coffeeMakerStatus,
      lastBrew: "7:30 AM",
      icon: <Coffee className="h-5 w-5" />,
      color: "text-amber-600",
    },
    {
      name: "Smart Scale",
      status: "ready",
      lastWeight: "250g flour",
      icon: <Utensils className="h-5 w-5" />,
      color: "text-blue-500",
    },
  ]

  const voiceCommands = [
    "Start cooking chocolate chip cookies",
    "Set timer for 10 minutes",
    "What's the next step?",
    "Preheat oven to 375 degrees",
    "Start coffee maker",
    "How much flour do I need?",
  ]

  const startRecipe = (recipe) => {
    setActiveRecipe(recipe)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (activeRecipe && currentStep < activeRecipe.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addTimer = (minutes) => {
    const newTimer = {
      id: Date.now(),
      name: `Timer ${timers.length + 1}`,
      duration: minutes * 60,
      remaining: minutes * 60,
      active: true,
    }
    setTimers([...timers, newTimer])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <ChefHat className="h-10 w-10 text-orange-500" />
            Kitchen Assistant
          </h1>
          <p className="text-xl text-slate-600">
            Your AI-powered cooking companion with voice guidance and smart appliance control
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe Selection & Active Recipe */}
          <div className="lg:col-span-2 space-y-6">
            {!activeRecipe ? (
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Choose a Recipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recipes.map((recipe) => (
                      <motion.div
                        key={recipe.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => startRecipe(recipe)}
                      >
                        <h3 className="font-semibold mb-2">{recipe.name}</h3>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline">{recipe.difficulty}</Badge>
                          <Badge variant="outline">{recipe.time}</Badge>
                          <Badge variant="outline">{recipe.servings} servings</Badge>
                        </div>
                        <Button className="w-full">Start Cooking</Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{activeRecipe.name}</span>
                    <Button variant="outline" onClick={() => setActiveRecipe(null)}>
                      Change Recipe
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {currentStep + 1} of {activeRecipe.steps.length}
                      </span>
                    </div>
                    <Progress value={((currentStep + 1) / activeRecipe.steps.length) * 100} />
                  </div>

                  {/* Current Step */}
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Step {currentStep + 1}</h4>
                    <p className="text-lg">{activeRecipe.steps[currentStep]}</p>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={previousStep} disabled={currentStep === 0}>
                      Previous
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={currentStep === activeRecipe.steps.length - 1}
                      className="flex-1"
                    >
                      Next Step
                    </Button>
                  </div>

                  {/* Ingredients List */}
                  <div className="space-y-2">
                    <h4 className="font-semibold">Ingredients</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activeRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{ingredient}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voice Commands */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-blue-500" />
                  Voice Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {voiceCommands.map((command, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto p-3 bg-transparent"
                      onClick={() => setIsListening(true)}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />"{command}"
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Smart Appliances */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Smart Appliances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {smartAppliances.map((appliance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={appliance.color}>{appliance.icon}</div>
                      <div>
                        <p className="font-medium text-sm">{appliance.name}</p>
                        <p className="text-xs text-slate-500">
                          {appliance.temperature
                            ? `${appliance.temperature}°F`
                            : appliance.lastBrew || appliance.lastWeight}
                        </p>
                      </div>
                    </div>
                    <Badge variant={appliance.status === "ready" ? "outline" : "default"}>{appliance.status}</Badge>
                  </div>
                ))}

                {/* Oven Temperature Control */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Oven Temperature</label>
                  <Slider
                    value={ovenTemp}
                    onValueChange={setOvenTemp}
                    max={500}
                    min={200}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>200°F</span>
                    <span>{ovenTemp[0]}°F</span>
                    <span>500°F</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Timers */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Timers
                  </span>
                  <Button size="sm" onClick={() => addTimer(10)}>
                    Add Timer
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timers.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No active timers</p>
                ) : (
                  <div className="space-y-3">
                    {timers.map((timer) => (
                      <div key={timer.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{timer.name}</span>
                          <Badge variant="default">Active</Badge>
                        </div>
                        <div className="text-2xl font-mono text-center">
                          {Math.floor(timer.remaining / 60)}:{(timer.remaining % 60).toString().padStart(2, "0")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => setCoffeeMakerStatus("brewing")}>
                  <Coffee className="h-4 w-4 mr-2" />
                  Start Coffee
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Recipe Book
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Utensils className="h-4 w-4 mr-2" />
                  Meal Planner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
