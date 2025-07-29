"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Lightbulb,
  Thermometer,
  Lock,
  Camera,
  Speaker,
  Tv,
  Coffee,
  Car,
  Wifi,
  Battery,
  Settings,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export default function DeviceGrid() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Living Room Lights",
      type: "light",
      room: "Living Room",
      status: "on",
      value: 80,
      brand: "Philips Hue",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "text-yellow-500",
      lastUsed: "2 min ago",
    },
    {
      id: 2,
      name: "Main Thermostat",
      type: "thermostat",
      room: "Hallway",
      status: "on",
      value: 72,
      brand: "Nest",
      icon: <Thermometer className="h-5 w-5" />,
      color: "text-blue-500",
      lastUsed: "5 min ago",
    },
    {
      id: 3,
      name: "Front Door Lock",
      type: "lock",
      room: "Entrance",
      status: "locked",
      value: 100,
      brand: "August",
      icon: <Lock className="h-5 w-5" />,
      color: "text-green-500",
      lastUsed: "1 hour ago",
    },
    {
      id: 4,
      name: "Security Camera",
      type: "camera",
      room: "Front Yard",
      status: "recording",
      value: 95,
      brand: "Ring",
      icon: <Camera className="h-5 w-5" />,
      color: "text-red-500",
      lastUsed: "Active",
    },
    {
      id: 5,
      name: "Living Room Speaker",
      type: "speaker",
      room: "Living Room",
      status: "playing",
      value: 65,
      brand: "Sonos",
      icon: <Speaker className="h-5 w-5" />,
      color: "text-purple-500",
      lastUsed: "Now playing",
    },
    {
      id: 6,
      name: "Smart TV",
      type: "tv",
      room: "Living Room",
      status: "off",
      value: 0,
      brand: "Samsung",
      icon: <Tv className="h-5 w-5" />,
      color: "text-slate-500",
      lastUsed: "3 hours ago",
    },
    {
      id: 7,
      name: "Coffee Maker",
      type: "appliance",
      room: "Kitchen",
      status: "scheduled",
      value: 100,
      brand: "Keurig",
      icon: <Coffee className="h-5 w-5" />,
      color: "text-amber-500",
      lastUsed: "Tomorrow 7 AM",
    },
    {
      id: 8,
      name: "Tesla Model 3",
      type: "vehicle",
      room: "Garage",
      status: "charging",
      value: 85,
      brand: "Tesla",
      icon: <Car className="h-5 w-5" />,
      color: "text-emerald-500",
      lastUsed: "Charging",
    },
  ])

  const handleDeviceAction = (deviceId: number, action: string, value: number | null = null) => {
    setDevices(
      devices.map((device) => {
        if (device.id === deviceId) {
          switch (action) {
            case "toggle":
              return { ...device, status: device.status === "on" ? "off" : "on" }
            case "setValue":
              return { ...device, value: value }
            case "lock":
              return { ...device, status: device.status === "locked" ? "unlocked" : "locked" }
            default:
              return device
          }
        }
        return device
      }),
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      on: { variant: "default" as const, color: "bg-green-500" },
      off: { variant: "secondary" as const, color: "bg-slate-400" },
      locked: { variant: "default" as const, color: "bg-green-500" },
      recording: { variant: "destructive" as const, color: "bg-red-500" },
      playing: { variant: "default" as const, color: "bg-purple-500" },
      scheduled: { variant: "outline" as const, color: "bg-amber-500" },
      charging: { variant: "default" as const, color: "bg-blue-500" },
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.off
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-500" />
            Connected Devices
          </span>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-slate-100 ${device.color}`}>{device.icon}</div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{device.name}</h4>
                    <p className="text-xs text-slate-500">
                      {device.room} • {device.brand}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge {...getStatusBadge(device.status)}>{device.status}</Badge>
                    {device.type === "light" || device.type === "speaker" ? (
                      <Switch
                        checked={device.status === "on" || device.status === "playing"}
                        onCheckedChange={() => handleDeviceAction(device.id, "toggle")}
                      />
                    ) : device.type === "lock" ? (
                      <Switch
                        checked={device.status === "locked"}
                        onCheckedChange={() => handleDeviceAction(device.id, "lock")}
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <Battery className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{device.value}%</span>
                      </div>
                    )}
                  </div>

                  {(device.type === "light" || device.type === "speaker" || device.type === "thermostat") && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>
                          {device.type === "thermostat"
                            ? "Temperature"
                            : device.type === "speaker"
                              ? "Volume"
                              : "Brightness"}
                        </span>
                        <span>
                          {device.value}
                          {device.type === "thermostat" ? "°F" : "%"}
                        </span>
                      </div>
                      <Slider
                        value={[device.value]}
                        onValueChange={(value) => handleDeviceAction(device.id, "setValue", value[0])}
                        max={device.type === "thermostat" ? 85 : 100}
                        min={device.type === "thermostat" ? 60 : 0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-400">Last used: {device.lastUsed}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
