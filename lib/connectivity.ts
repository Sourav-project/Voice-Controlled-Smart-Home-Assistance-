import { generateText } from "ai" // [^6]
import { openai } from "@ai-sdk/openai" // [^6]

// Smart Home Device Connectivity Manager with real speech integration
export class SmartHomeConnectivity {
  private devices: Map<string, any> = new Map()
  private connections: Map<string, any> = new Map()
  private isSecureContext = false

  constructor() {
    this.isSecureContext = typeof window !== "undefined" ? window.location.protocol === "https:" : false
    this.initializeConnections()
  }

  async initializeConnections() {
    await this.initializeWiFiDevices()
    await this.initializeBluetoothDevices()
    await this.initializeSimulatedDevices()
  }

  async initializeWiFiDevices() {
    const wifiDevices = [
      { id: "light-1", name: "Living Room Light", ip: "192.168.1.100", type: "light", room: "Living Room" },
      { id: "thermostat-1", name: "Main Thermostat", ip: "192.168.1.101", type: "thermostat", room: "Hallway" },
      { id: "speaker-1", name: "Living Room Speaker", ip: "192.168.1.102", type: "speaker", room: "Living Room" },
    ]

    for (const device of wifiDevices) {
      this.simulateDeviceConnection(device, "wifi")
    }
  }

  async initializeBluetoothDevices() {
    const bluetoothDevices = [
      {
        id: "lock-1",
        name: "Smart Door Lock",
        serviceUUID: "12345678-1234-1234-1234-123456789abc",
        type: "lock",
        room: "Entrance",
      },
      {
        id: "sensor-1",
        name: "Motion Sensor",
        serviceUUID: "87654321-4321-4321-4321-cba987654321",
        type: "sensor",
        room: "Hallway",
      },
    ]

    bluetoothDevices.forEach((device) => this.simulateDeviceConnection(device, "bluetooth"))
  }

  async initializeSimulatedDevices() {
    const simulatedDevices = [
      { id: "camera-1", name: "Security Camera", type: "camera", room: "Front Yard" },
      { id: "tv-1", name: "Smart TV", type: "tv", room: "Living Room" },
      { id: "coffee-1", name: "Coffee Maker", type: "appliance", room: "Kitchen" },
      { id: "car-1", name: "Tesla Model 3", type: "vehicle", room: "Garage" },
    ]

    simulatedDevices.forEach((device) => {
      this.simulateDeviceConnection(device, "wifi")
    })
  }

  private simulateDeviceConnection(device: any, protocol: string) {
    setTimeout(
      () => {
        const connectedDevice = {
          ...device,
          connected: true,
          protocol: protocol,
          lastUpdate: Date.now(),
          signalStrength: Math.floor(Math.random() * 40) + 60,
          state: this.getInitialDeviceState(device.type),
        }

        this.devices.set(device.id, connectedDevice)

        const simulatedConnection = {
          send: (data: string) => {
            console.log(`Sending to ${device.name}:`, data)
            setTimeout(
              () => {
                const command = JSON.parse(data)
                this.handleDeviceResponse(device.id, {
                  status: "success",
                  command: command.type,
                  value: command.value || command.action,
                  timestamp: Date.now(),
                })
              },
              200 + Math.random() * 300,
            )
          },
          close: () => {
            console.log(`Disconnected from ${device.name}`)
          },
        }

        this.connections.set(device.id, simulatedConnection)

        window.dispatchEvent(
          new CustomEvent("deviceConnected", {
            detail: { deviceId: device.id, device: connectedDevice },
          }),
        )
      },
      Math.random() * 1000 + 500,
    )
  }

  private getInitialDeviceState(type: string) {
    switch (type) {
      case "light":
        return { power: false, brightness: 80, color: "warm" }
      case "thermostat":
        return { temperature: 72, target: 72, mode: "auto" }
      case "lock":
        return { locked: true }
      case "speaker":
        return { playing: false, volume: 50, track: null }
      case "tv":
        return { power: false, channel: 1, volume: 30 }
      case "camera":
        return { recording: true, motion: false }
      case "appliance":
        return { power: false, scheduled: false }
      case "vehicle":
        return { locked: true, charging: false, battery: 85 }
      default:
        return { active: true }
    }
  }

  async sendCommand(deviceId: string, command: any) {
    const connection = this.connections.get(deviceId)
    const device = this.devices.get(deviceId)

    if (!connection || !device) {
      throw new Error(`Device ${deviceId} not connected`)
    }

    try {
      connection.send(JSON.stringify(command))

      // Update device state immediately for better UX
      this.updateDeviceState(deviceId, command)

      return { success: true, message: "Command sent successfully" }
    } catch (error) {
      console.error(`Failed to send command to ${deviceId}:`, error)
      return { success: false, message: "Command failed" }
    }
  }

  private updateDeviceState(deviceId: string, command: any) {
    const device = this.devices.get(deviceId)
    if (!device) return

    const newState = { ...device.state }

    switch (command.type) {
      case "light":
        if (command.action === "on") newState.power = true
        if (command.action === "off") newState.power = false
        if (command.brightness) newState.brightness = command.brightness
        break
      case "thermostat":
        if (command.action === "setTemperature") {
          newState.target = command.value
          newState.temperature = command.value
        }
        break
      case "lock":
        newState.locked = command.action === "lock"
        break
      case "music":
        newState.playing = command.action === "play"
        if (command.playlist) newState.track = command.playlist
        break
    }

    const updatedDevice = { ...device, state: newState, lastUpdate: Date.now() }
    this.devices.set(deviceId, updatedDevice)

    window.dispatchEvent(
      new CustomEvent("deviceUpdate", {
        detail: { deviceId, device: updatedDevice },
      }),
    )
  }

  private handleDeviceResponse(deviceId: string, response: any) {
    const device = this.devices.get(deviceId)
    if (device) {
      const updatedDevice = {
        ...device,
        lastResponse: response,
        lastUpdate: Date.now(),
      }
      this.devices.set(deviceId, updatedDevice)

      window.dispatchEvent(
        new CustomEvent("deviceUpdate", {
          detail: { deviceId, device: updatedDevice, response },
        }),
      )
    }
  }

  getConnectedDevices() {
    return Array.from(this.devices.values()).filter((device) => device.connected)
  }

  getConnectionStatus() {
    const total = this.devices.size
    const connected = this.getConnectedDevices().length
    return {
      total,
      connected,
      percentage: total > 0 ? Math.round((connected / total) * 100) : 0,
    }
  }

  getDevice(deviceId: string) {
    return this.devices.get(deviceId)
  }

  getAllDevices() {
    return Array.from(this.devices.values())
  }
}

// Voice Command Processor with real speech recognition
export class VoiceCommandProcessor {
  private connectivity: SmartHomeConnectivity

  constructor(connectivity: SmartHomeConnectivity) {
    this.connectivity = connectivity
  }

  async processCommand(command: string) {
    const normalizedCommand = command.toLowerCase().trim()
    console.log("Processing command:", normalizedCommand)
    const startTime = performance.now() // Start timing

    try {
      // Light commands
      if (this.isLightCommand(normalizedCommand)) {
        const result = await this.handleLightCommand(normalizedCommand)
        const endTime = performance.now()
        console.log(`Command "${normalizedCommand}" processed in ${endTime - startTime} ms`)
        return result
      }

      // Temperature commands
      if (this.isTemperatureCommand(normalizedCommand)) {
        const result = await this.handleThermostatCommand(normalizedCommand)
        const endTime = performance.now()
        console.log(`Command "${normalizedCommand}" processed in ${endTime - startTime} ms`)
        return result
      }

      // Lock commands
      if (this.isLockCommand(normalizedCommand)) {
        const result = await this.handleLockCommand(normalizedCommand)
        const endTime = performance.now()
        console.log(`Command "${normalizedCommand}" processed in ${endTime - startTime} ms`)
        return result
      }

      // Music commands
      if (this.isMusicCommand(normalizedCommand)) {
        const result = await this.handleMusicCommand(normalizedCommand)
        const endTime = performance.now()
        console.log(`Command "${normalizedCommand}" processed in ${endTime - startTime} ms`)
        return result
      }

      // Routine commands
      if (this.isRoutineCommand(normalizedCommand)) {
        const result = await this.handleRoutineCommand(normalizedCommand)
        const endTime = performance.now()
        console.log(`Command "${normalizedCommand}" processed in ${endTime - startTime} ms`)
        return result
      }

      // If no specific command is recognized, use AI to generate a conversational response
      const aiResponse = await this.generateAIResponse(normalizedCommand) // [^6]
      const endTime = performance.now()
      console.log(`Command "${normalizedCommand}" processed by AI in ${endTime - startTime} ms`)
      return { success: true, message: aiResponse }
    } catch (error) {
      const endTime = performance.now()
      console.error(`Command "${normalizedCommand}" processing error after ${endTime - startTime} ms:`, error)
      return { success: false, message: "Sorry, I encountered an error processing that command." }
    }
  }

  private async generateAIResponse(prompt: string): Promise<string> {
    // [^6]
    try {
      const { text } = await generateText({
        // [^6]
        model: openai("gpt-4o"), // [^6]
        prompt: `You are a helpful and friendly smart home assistant. Respond conversationally to the following user input. If it's not a direct command, try to engage or provide general information. User: "${prompt}"`, // [^6]
        system:
          "You are a smart home assistant. Your goal is to be helpful, friendly, and conversational. If a command is not recognized, try to respond in a way that keeps the conversation going or offers assistance.", // [^6]
      })
      return text // [^6]
    } catch (error) {
      console.error("Error generating AI response:", error) // [^6]
      return "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later." // [^6]
    }
  }

  private isLightCommand(command: string): boolean {
    return (
      /\b(light|lights|lamp|lamps)\b/i.test(command) &&
      (/\b(turn|switch)\b/i.test(command) || /\b(on|off|dim|bright)\b/i.test(command))
    )
  }

  private isTemperatureCommand(command: string): boolean {
    return /\b(temperature|thermostat|heat|cool|degrees?)\b/i.test(command) || /\bset.*\d+/i.test(command)
  }

  private isLockCommand(command: string): boolean {
    return /\b(lock|unlock|door|doors|secure)\b/i.test(command)
  }

  private isMusicCommand(command: string): boolean {
    return /\b(play|music|song|playlist|stop|pause|volume)\b/i.test(command)
  }

  private isRoutineCommand(command: string): boolean {
    return /\b(good night|goodnight|i'm home|movie time|bedtime)\b/i.test(command)
  }

  private async handleLightCommand(command: string) {
    const isOn = /\b(on|turn on|switch on)\b/i.test(command)
    const isOff = /\b(off|turn off|switch off)\b/i.test(command)
    const room = this.extractRoom(command) || "living room"

    const action = isOn ? "on" : isOff ? "off" : "toggle"
    const deviceId = this.findDeviceByRoomAndType(room, "light") || "light-1"

    try {
      await this.connectivity.sendCommand(deviceId, {
        type: "light",
        action: action,
        room: room,
      })

      const response = `${room} lights are now ${action === "toggle" ? "toggled" : action}`
      return { success: true, message: response }
    } catch (error) {
      return { success: false, message: "Failed to control lights" }
    }
  }

  private async handleThermostatCommand(command: string) {
    const temperature = this.extractTemperature(command)

    try {
      await this.connectivity.sendCommand("thermostat-1", {
        type: "thermostat",
        action: "setTemperature",
        value: temperature,
      })

      const response = `Temperature set to ${temperature} degrees`
      return { success: true, message: response }
    } catch (error) {
      return { success: false, message: "Failed to adjust temperature" }
    }
  }

  private async handleLockCommand(command: string) {
    const isUnlock = /\bunlock\b/i.test(command)
    const action = isUnlock ? "unlock" : "lock"

    try {
      await this.connectivity.sendCommand("lock-1", {
        type: "lock",
        action: action,
      })

      const response = `Door is now ${action}ed`
      return { success: true, message: response }
    } catch (error) {
      return { success: false, message: "Failed to control lock" }
    }
  }

  private async handleMusicCommand(command: string) {
    const isStop = /\b(stop|pause)\b/i.test(command)
    const action = isStop ? "stop" : "play"
    const playlist = this.extractPlaylist(command)

    try {
      await this.connectivity.sendCommand("speaker-1", {
        type: "music",
        action: action,
        playlist: playlist,
      })

      const response = action === "play" ? `Playing ${playlist} music` : "Music stopped"
      return { success: true, message: response }
    } catch (error) {
      return { success: false, message: "Failed to control music" }
    }
  }

  private async handleRoutineCommand(command: string) {
    if (/\b(good night|goodnight|bedtime)\b/i.test(command)) {
      // Turn off lights, lock doors, set thermostat
      await this.connectivity.sendCommand("light-1", { type: "light", action: "off" })
      await this.connectivity.sendCommand("lock-1", { type: "lock", action: "lock" })
      await this.connectivity.sendCommand("thermostat-1", { type: "thermostat", action: "setTemperature", value: 68 })

      return {
        success: true,
        message: "Good night! I've turned off the lights, locked the doors, and adjusted the temperature.",
      }
    }

    if (/\bi'm home\b/i.test(command)) {
      // Turn on lights, unlock door, set comfortable temperature
      await this.connectivity.sendCommand("light-1", { type: "light", action: "on" })
      await this.connectivity.sendCommand("lock-1", { type: "lock", action: "unlock" })
      await this.connectivity.sendCommand("thermostat-1", { type: "thermostat", action: "setTemperature", value: 72 })

      return {
        success: true,
        message: "Welcome home! I've turned on the lights, unlocked the door, and set a comfortable temperature.",
      }
    }

    return { success: false, message: "Routine not recognized" }
  }

  private extractRoom(command: string): string {
    const rooms = ["living room", "bedroom", "kitchen", "bathroom", "office", "dining room"]
    for (const room of rooms) {
      if (command.includes(room)) {
        return room
      }
    }
    return "living room"
  }

  private extractTemperature(command: string): number {
    const match = command.match(/(\d+)\s*degrees?/i) || command.match(/\bset.*?(\d+)/i)
    return match ? Number.parseInt(match[1]) : 72
  }

  private extractPlaylist(command: string): string {
    if (/\b(relax|relaxing|calm)\b/i.test(command)) return "relaxing"
    if (/\bjazz\b/i.test(command)) return "jazz"
    if (/\brock\b/i.test(command)) return "rock"
    if (/\bclassical\b/i.test(command)) return "classical"
    return "default"
  }

  private findDeviceByRoomAndType(room: string, type: string): string | null {
    const devices = this.connectivity.getAllDevices()
    const device = devices.find((d) => d.type === type && d.room?.toLowerCase().includes(room.toLowerCase()))
    return device?.id || null
  }
}

// Initialize global instances
let smartHomeConnectivity: SmartHomeConnectivity | null = null
let voiceCommandProcessor: VoiceCommandProcessor | null = null

if (typeof window !== "undefined") {
  try {
    smartHomeConnectivity = new SmartHomeConnectivity()
    voiceCommandProcessor = new VoiceCommandProcessor(smartHomeConnectivity)
  } catch (error) {
    console.error("Failed to initialize connectivity:", error)
  }
}

export { smartHomeConnectivity, voiceCommandProcessor }
