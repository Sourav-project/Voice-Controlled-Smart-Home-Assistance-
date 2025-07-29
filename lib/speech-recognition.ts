// Enhanced Speech Recognition with cross-platform support
export class EnhancedSpeechRecognition {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private isSupported = false
  private isMobile = false

  constructor() {
    this.detectDevice()
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
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
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices not supported")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Mobile-specific audio constraints
          ...(this.isMobile && {
            sampleRate: 16000,
            channelCount: 1,
          }),
        },
      })

      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach((track) => track.stop())
      return true
    } catch (error) {
      console.error("Microphone permission denied:", error)
      return false
    }
  }

  async startListening(): Promise<{ transcript: string; confidence: number; isFinal: boolean }> {
    return new Promise(async (resolve, reject) => {
      if (!this.isSupported) {
        reject(new Error("Speech recognition not supported"))
        return
      }

      if (this.isListening) {
        reject(new Error("Already listening"))
        return
      }

      // Request microphone permission first
      const hasPermission = await this.requestMicrophonePermission()
      if (!hasPermission) {
        reject(new Error("Microphone permission required"))
        return
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
            // For mobile, we might want to resolve interim results
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

        // Handle different error types
        switch (event.error) {
          case "not-allowed":
            reject(new Error("Microphone access denied. Please allow microphone access and try again."))
            break
          case "no-speech":
            reject(new Error("No speech detected. Please try speaking again."))
            break
          case "audio-capture":
            reject(new Error("Audio capture failed. Please check your microphone."))
            break
          case "network":
            reject(new Error("Network error. Please check your internet connection."))
            break
          default:
            reject(new Error(`Speech recognition error: ${event.error}`))
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
                reject(new Error("No speech detected within timeout period"))
              }
            }
          }, 10000) // 10 second timeout for mobile
        }
      } catch (error) {
        this.isListening = false
        reject(error)
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

      // Mobile-specific voice selection
      if (this.isMobile) {
        const voices = this.synthesis.getVoices()
        const preferredVoice = voices.find((voice) => voice.lang.startsWith("en") && voice.localService)
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
