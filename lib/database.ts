// This is a mock database for demonstration purposes
// In a real application, this would connect to a real database

export interface Device {
  id: string
  name: string
  type: "light" | "thermostat" | "lock" | "camera" | "speaker" | "plug"
  room: string
  state: any
  brand: string
  commands: string[]
}

export interface VoiceCommand {
  id: string
  phrase: string
  action: string
  deviceIds: string[]
  isCustom: boolean
}

export interface User {
  id: string
  name: string
  email: string
  voiceProfile: string
  devices: Device[]
  customCommands: VoiceCommand[]
}

// Mock data
export const devices: Device[] = [
  {
    id: "light-1",
    name: "Living Room Light",
    type: "light",
    room: "Living Room",
    state: { power: false, brightness: 80, color: "warm" },
    brand: "Philips Hue",
    commands: ["turn on", "turn off", "dim", "brighten", "change color"],
  },
  {
    id: "thermostat-1",
    name: "Main Thermostat",
    type: "thermostat",
    room: "Hallway",
    state: { power: true, temperature: 72, mode: "cool" },
    brand: "Nest",
    commands: ["set temperature", "turn on heat", "turn on cooling", "set schedule"],
  },
  {
    id: "lock-1",
    name: "Front Door",
    type: "lock",
    room: "Entrance",
    state: { locked: true },
    brand: "August",
    commands: ["lock", "unlock", "check status"],
  },
  {
    id: "speaker-1",
    name: "Living Room Speaker",
    type: "speaker",
    room: "Living Room",
    state: { power: false, volume: 50, playing: null },
    brand: "Sonos",
    commands: ["play music", "pause", "next track", "previous track", "set volume"],
  },
]

export const voiceCommands: VoiceCommand[] = [
  {
    id: "cmd-1",
    phrase: "I'm home",
    action: "runRoutine",
    deviceIds: ["light-1", "thermostat-1", "lock-1"],
    isCustom: true,
  },
  {
    id: "cmd-2",
    phrase: "Movie time",
    action: "runRoutine",
    deviceIds: ["light-1", "speaker-1"],
    isCustom: true,
  },
  {
    id: "cmd-3",
    phrase: "Good night",
    action: "runRoutine",
    deviceIds: ["light-1", "thermostat-1", "lock-1", "speaker-1"],
    isCustom: true,
  },
]

export const users: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    voiceProfile: "voice-profile-1",
    devices: devices,
    customCommands: voiceCommands,
  },
]

// Mock API functions
export async function getDevices(): Promise<Device[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(devices), 500)
  })
}

export async function getDevice(id: string): Promise<Device | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(devices.find((device) => device.id === id)), 300)
  })
}

export async function updateDeviceState(id: string, newState: any): Promise<Device | undefined> {
  return new Promise((resolve) => {
    const device = devices.find((device) => device.id === id)
    if (device) {
      device.state = { ...device.state, ...newState }
    }
    setTimeout(() => resolve(device), 300)
  })
}

export async function getVoiceCommands(): Promise<VoiceCommand[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(voiceCommands), 500)
  })
}

