"use client"

import { useState, useEffect } from "react"
import { Wifi, Bluetooth, Smartphone, AlertCircle, CheckCircle, RefreshCw, Signal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ConnectivityStatus() {
  const [connectionStatus, setConnectionStatus] = useState({
    total: 0,
    connected: 0,
    percentage: 0,
  })
  const [devices, setDevices] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // Initialize with simulated data
    const simulatedDevices = [
      {
        id: "light-1",
        name: "Living Room Light",
        type: "light",
        protocol: "wifi",
        connected: true,
        signalStrength: 85,
      },
      {
        id: "thermostat-1",
        name: "Main Thermostat",
        type: "thermostat",
        protocol: "wifi",
        connected: true,
        signalStrength: 92,
      },
      {
        id: "lock-1",
        name: "Smart Door Lock",
        type: "lock",
        protocol: "bluetooth",
        connected: true,
        signalStrength: 78,
      },
      {
        id: "speaker-1",
        name: "Living Room Speaker",
        type: "speaker",
        protocol: "wifi",
        connected: true,
        signalStrength: 88,
      },
      {
        id: "camera-1",
        name: "Security Camera",
        type: "camera",
        protocol: "wifi",
        connected: true,
        signalStrength: 95,
      },
      {
        id: "tv-1",
        name: "Smart TV",
        type: "tv",
        protocol: "wifi",
        connected: false,
        signalStrength: 0,
      },
    ]

    setDevices(simulatedDevices)
    const connected = simulatedDevices.filter((d) => d.connected).length
    setConnectionStatus({
      total: simulatedDevices.length,
      connected,
      percentage: Math.round((connected / simulatedDevices.length) * 100),
    })

    // Listen for device updates
    const handleDeviceUpdate = (event: CustomEvent) => {
      updateDeviceStatus(event.detail.deviceId, event.detail.device)
    }

    const handleDeviceConnected = (event: CustomEvent) => {
      updateDeviceStatus(event.detail.deviceId, event.detail.device)
    }

    window.addEventListener("deviceUpdate", handleDeviceUpdate as EventListener)
    window.addEventListener("deviceConnected", handleDeviceConnected as EventListener)

    return () => {
      window.removeEventListener("deviceUpdate", handleDeviceUpdate as EventListener)
      window.removeEventListener("deviceConnected", handleDeviceConnected as EventListener)
    }
  }, [])

  const updateDeviceStatus = (deviceId: string, deviceData: any) => {
    setDevices((prev) => {
      const updated = prev.map((device) =>
        device.id === deviceId
          ? { ...device, ...deviceData, signalStrength: deviceData.signalStrength || device.signalStrength }
          : device,
      )

      const connected = updated.filter((d) => d.connected).length
      setConnectionStatus({
        total: updated.length,
        connected,
        percentage: Math.round((connected / updated.length) * 100),
      })

      return updated
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)

    // Simulate refresh process
    setTimeout(() => {
      setDevices((prev) =>
        prev.map((device) => ({
          ...device,
          signalStrength: device.connected ? Math.floor(Math.random() * 40) + 60 : 0,
          lastUpdate: Date.now(),
        })),
      )
      setIsRefreshing(false)
    }, 1500)
  }

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case "wifi":
        return <Wifi className="h-4 w-4 text-blue-500" />
      case "bluetooth":
        return <Bluetooth className="h-4 w-4 text-blue-600" />
      default:
        return <Smartphone className="h-4 w-4 text-gray-500" />
    }
  }

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 80) return "text-green-500"
    if (strength >= 60) return "text-yellow-500"
    if (strength >= 40) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Device Connectivity
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Connection Status</span>
            <span className="text-sm text-slate-600">
              {connectionStatus.connected}/{connectionStatus.total} devices
            </span>
          </div>
          <Progress value={connectionStatus.percentage} className="h-2" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Offline</span>
            <span>{connectionStatus.percentage}% Connected</span>
            <span>Online</span>
          </div>
        </div>

        {/* Device List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Connected Devices</h4>
          {devices.length === 0 ? (
            <div className="text-center py-4 text-slate-500">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No devices found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {devices.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getProtocolIcon(device.protocol)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-slate-500">
                        {device.type} • {device.protocol}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.connected && (
                      <div className="flex items-center gap-1">
                        <Signal className={`h-3 w-3 ${getSignalStrengthColor(device.signalStrength)}`} />
                        <span className="text-xs text-slate-500">{device.signalStrength}%</span>
                      </div>
                    )}
                    <Badge variant={device.connected ? "default" : "secondary"}>
                      {device.connected ? "Connected" : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Protocol Status */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div className="text-center">
            <Wifi className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <p className="text-xs font-medium">Wi-Fi</p>
            <p className="text-xs text-green-600">Secure Connection</p>
          </div>
          <div className="text-center">
            <Bluetooth className="h-6 w-6 mx-auto mb-1 text-blue-600" />
            <p className="text-xs font-medium">Bluetooth</p>
            <p className="text-xs text-green-600">Available</p>
          </div>
        </div>

        {/* Connection Info */}
        <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
          <p className="font-medium text-blue-700 mb-1">Demo Mode Active</p>
          <p>
            Connections are simulated for demonstration. In production, this would connect to real smart home devices
            via secure protocols.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
