// Enhanced Speech Recognition with cross-platform support
export class EnhancedSpeechRecognition {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private isSupported = false
  private isMobile = false
  private voices: SpeechSynthesisVoice[] = [] // Cache voices

  constructor() {
    this.detectDevice()
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
    if (typeof window !== "undefined") {
      // Populate voices once, and update if voices change
      this.voices = this.synthesis?.getVoices() || []
      if (this.synthesis) {
        this.synthesis.onvoiceschanged = () => {
          this.voices = this.synthesis?.getVoices() || []
        }
      }
    }
  }

  private detectDevice() {
    if (typeof window === "undefined") return

    // Detect mobile devices
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // Additional mobile detection
    if (!this.isMobile) {
      this.isMobile = window.innerWidth <= 768 || "ontouchstart" in window
    }
  }

  private initializeSpeechRecognition() {
    if (typeof window === "undefined") return

    try {
      // Try different speech recognition APIs
      if ("webkitSpeechRecognition" in window) {
        this.recognition = new (window as any).webkitSpeechRecognition()
        this.isSupported = true
      } else if ("SpeechRecognition" in window) {
        this.recognition = new (window as any).SpeechRecognition()
        this.isSupported = true
      } else {
        console.log("Speech recognition not supported in this browser")
        this.isSupported = false
        return
      }

      // Configure recognition settings
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = "en-US"
      this.recognition.maxAlternatives = 3

      // Mobile-specific optimizations
      if (this.isMobile) {
        this.recognition.continuous = false
        this.recognition.interimResults = false
      }
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error)
      this.isSupported = false
    }
  }

  private initializeSpeechSynthesis() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  async requestMicrophonePermission(): Promise<boolean> {
    try {
      // Check if we're in a secure context (HTTPS or localhost)
      if (typeof window !== "undefined" && !window.isSecureContext && window.location.hostname !== "localhost") {
        console.warn("Microphone requires HTTPS or localhost")
        return false
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("getUserMedia not supported")
        return false
      }

      // Check existing permissions first
      if (navigator.permissions) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName })
          if (permissionStatus.state === "granted") {
            return true
          }
          if (permissionStatus.state === "denied") {
            console.warn("Microphone permission previously denied")
            return false
          }
        } catch (error) {
          // Permissions API might not be fully supported, continue with getUserMedia
          console.log("Permissions API not fully supported, trying getUserMedia")
        }
      }

      // Request microphone access with minimal constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Minimal constraints for better compatibility
          ...(this.isMobile && {
            sampleRate: { ideal: 16000 },
            channelCount: { ideal: 1 },
          }),
        },
      })

      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach((track) => track.stop())
      return true
    } catch (error: any) {
      console.error("Microphone permission error:", error)

      // Handle different error types
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        console.warn("User denied microphone permission")
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        console.warn("No microphone found")
      } else if (error.name === "NotSupportedError") {
        console.warn("Microphone not supported")
      } else if (error.name === "NotReadableError") {
        console.warn("Microphone already in use")
      }

      return false
    }
  }

  async startListening(): Promise<{ transcript: string; confidence: number; isFinal: boolean }> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("Speech recognition not supported on this browser"))
        return
      }

      if (this.isListening) {
        reject(new Error("Already listening"))
        return
      }

      // Check microphone permission without requesting it first
      let hasPermission = false
      try {
        if (navigator.permissions) {
          const permissionStatus = await navigator.permissions.query({ name: "microphone" as PermissionName })
          hasPermission = permissionStatus.state === "granted"
        }
      } catch (error) {
        // Permissions API not supported, we'll try anyway
        hasPermission = true
      }

      // Only request permission if we don't have it
      if (!hasPermission) {
        const permissionGranted = await this.requestMicrophonePermission()
        if (!permissionGranted) {
          reject(
            new Error("Microphone permission is required. Please allow microphone access in your browser settings."),
          )
          return
        }
      }

      this.isListening = true
      let finalTranscript = ""
      let interimTranscript = ""

      this.recognition.onstart = () => {
        console.log("Speech recognition started")
      }

      this.recognition.onresult = (event: any) => {
        interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence || 0.8

          if (event.results[i].isFinal) {
            finalTranscript += transcript
            resolve({
              transcript: finalTranscript.trim(),
              confidence: confidence,
              isFinal: true,
            })
          } else {
            interimTranscript += transcript
            // For mobile, resolve interim results if they're substantial
            if (this.isMobile && transcript.trim().length > 3) {
              resolve({
                transcript: transcript.trim(),
                confidence: confidence,
                isFinal: false,
              })
            }
          }
        }
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        console.error("Speech recognition error:", event.error)

        // Handle different error types with user-friendly messages
        switch (event.error) {
          case "not-allowed":
            reject(
              new Error(
                "🚫 Microphone access denied. Please click the microphone icon in your browser's address bar and allow access.",
              ),
            )
            break
          case "no-speech":
            reject(new Error("🔇 No speech detected. Please try speaking again."))
            break
          case "audio-capture":
            reject(new Error("🎤 Microphone not available. Please check your microphone connection."))
            break
          case "network":
            reject(new Error("🌐 Network error. Please check your internet connection."))
            break
          case "service-not-allowed":
            reject(new Error("🔒 Speech service not allowed. Please use HTTPS or localhost."))
            break
          default:
            reject(new Error(`❌ Speech recognition error: ${event.error}. Please try again.`))
        }
      }

      this.recognition.onend = () => {
        this.isListening = false
        console.log("Speech recognition ended")
      }

      try {
        this.recognition.start()

        // Set a timeout for mobile devices
        if (this.isMobile) {
          setTimeout(() => {
            if (this.isListening) {
              this.stopListening()
              if (!finalTranscript && !interimTranscript) {
                reject(new Error("⏱️ No speech detected within 10 seconds. Please try again."))
              }
            }
          }, 10000) // 10 second timeout for mobile
        }
      } catch (error: any) {
        this.isListening = false
        if (error.name === "InvalidStateError") {
          reject(new Error("🔄 Speech recognition is already running. Please wait and try again."))
        } else {
          reject(error)
        }
      }
    })
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  speak(text: string, options: { rate?: number; pitch?: number; volume?: number } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options.rate || 0.9
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 0.8

      // Mobile-specific voice selection - use cached voices
      if (this.isMobile && this.voices.length > 0) {
        const preferredVoice = this.voices.find((voice) => voice.lang.startsWith("en") && voice.localService)
        if (preferredVoice) {
          utterance.voice = preferredVoice
        }
      }

      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)

      this.synthesis.speak(utterance)
    })
  }

  getCapabilities() {
    return {
      speechRecognition: this.isSupported,
      speechSynthesis: !!this.synthesis,
      isMobile: this.isMobile,
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "unknown",
    }
  }

  isCurrentlyListening() {
    return this.isListening
  }
}

// Create singleton instance
let speechRecognition: EnhancedSpeechRecognition | null = null

if (typeof window !== "undefined") {
  speechRecognition = new EnhancedSpeechRecognition()
}

export { speechRecognition }
