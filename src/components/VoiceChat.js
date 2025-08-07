import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';

export default function VoiceChat({ onVoiceMessage, isListening, setIsListening }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [micPermission, setMicPermission] = useState('unknown'); // 'granted', 'denied', 'prompt', 'unknown'
  const [micLevel, setMicLevel] = useState(0); // Audio level for visual feedback
  const mediaRecorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const timeoutRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Make it more tolerant to silence
      if (recognitionRef.current.maxAlternatives) {
        recognitionRef.current.maxAlternatives = 1;
      }
      if (recognitionRef.current.serviceURI) {
        // Some browsers support these properties
        recognitionRef.current.serviceURI = 'builtin:speech/broadcast';
      }

      // Check microphone permission
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'microphone' }).then((result) => {
          setMicPermission(result.state);
          console.log('Microphone permission:', result.state);
        }).catch((error) => {
          console.log('Could not check microphone permission:', error);
          setMicPermission('unknown');
        });
      }

      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result received');
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript + interimTranscript;
        console.log('Transcript:', fullTranscript);
        setTranscript(fullTranscript);

        if (finalTranscript.trim()) {
          console.log('Final transcript:', finalTranscript);
          onVoiceMessage(finalTranscript);
          setTranscript('');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.log('=== SPEECH RECOGNITION ERROR ===');
        console.log('Error type:', event.error);
        console.log('Full event:', event);
        console.log('Current state:', { 
          isRecording, 
          isInitializing, 
          isActive: isRecognitionActiveRef.current 
        });
        
        // Reset the active state
        isRecognitionActiveRef.current = false;
        
        // Handle specific error types more gracefully
        if (event.error === 'aborted') {
          console.log('Speech recognition stopped by user or system');
          setIsRecording(false);
          setIsListening(false);
          setIsInitializing(false);
        } else if (event.error === 'no-speech') {
          console.log('No speech detected - trying to restart...');
          setIsInitializing(false);
          
          // Keep trying if we're still in recording mode
          if (isRecording) {
            setTimeout(() => {
              if (isRecording && !isRecognitionActiveRef.current) {
                console.log('Restarting after no-speech...');
                try {
                  recognitionRef.current.start();
                } catch (restartError) {
                  console.error('Failed to restart after no-speech:', restartError);
                }
              }
            }, 500);
          }
          return;
        } else if (event.error === 'audio-capture') {
          console.log('Audio capture error - microphone might be in use');
          alert('Microphone is busy or not available. Please check if another application is using it.');
          setIsRecording(false);
          setIsListening(false);
          setIsInitializing(false);
        } else if (event.error === 'network') {
          console.warn('Network error in speech recognition - will retry');
          setIsInitializing(false);
          // Auto-retry after network error
          setTimeout(() => {
            if (!isRecognitionActiveRef.current && isRecording) {
              console.log('Retrying after network error...');
              try {
                recognitionRef.current.start();
              } catch (retryError) {
                console.error('Failed to retry after network error:', retryError);
              }
            }
          }, 1000);
          return;
        } else {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          setIsListening(false);
          setIsInitializing(false);
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('=== RECOGNITION STARTED ===');
        isRecognitionActiveRef.current = true;
        setIsRecording(true);
        setIsListening(true);
        setIsInitializing(false);
      };

      recognitionRef.current.onend = () => {
        console.log('=== RECOGNITION ENDED ===');
        console.log('State at end:', { isRecording, isInitializing });
        isRecognitionActiveRef.current = false;
        
        // If we're still supposed to be recording (user hasn't clicked stop)
        // restart the recognition automatically
        if (isRecording && !isInitializing) {
          console.log('Auto-restarting recognition...');
          setTimeout(() => {
            if (isRecording && !isRecognitionActiveRef.current) {
              try {
                console.log('Attempting auto-restart...');
                recognitionRef.current.start();
                console.log('Recognition auto-restarted');
              } catch (error) {
                console.error('Failed to auto-restart recognition:', error);
                setIsRecording(false);
                setIsListening(false);
              }
            }
          }, 100);
        } else {
          // User manually stopped or initialization failed
          console.log('Stopping - user action or init failed');
          setIsRecording(false);
          setIsListening(false);
          setTranscript('');
          setIsInitializing(false);
        }
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      // Cleanup timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onVoiceMessage, setIsListening]);

  const startRecording = async () => {
    console.log('startRecording called');
    
    if (!speechSupported) {
      console.log('Speech not supported');
      return;
    }
    
    if (!recognitionRef.current) {
      console.log('No recognition ref');
      return;
    }
    
    if (isRecognitionActiveRef.current) {
      console.log('Recognition already active');
      return;
    }
    
    if (isInitializing) {
      console.log('Already initializing');
      return;
    }

    console.log('All checks passed, starting recording...');

    // Request microphone permission if needed
    if (micPermission === 'denied') {
      alert('Microphone access is denied. Please enable microphone access in your browser settings to use voice chat.');
      return;
    }

    try {
      // Request microphone access
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          console.log('Requesting microphone access...');
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setMicPermission('granted');
          console.log('Microphone access granted');
          
          // Set up audio level monitoring
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);
            
            // Start monitoring audio levels
            const monitorLevel = () => {
              if (analyserRef.current && isRecording) {
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setMicLevel(average);
                requestAnimationFrame(monitorLevel);
              }
            };
            monitorLevel();
          }
          
        } catch (permissionError) {
          console.error('Microphone permission denied:', permissionError);
          setMicPermission('denied');
          alert('Microphone access is required for voice chat. Please allow microphone access and try again.');
          return;
        }
      }

      setIsInitializing(true);
      setTranscript('');
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      console.log('Starting speech recognition...');
      console.log('About to set timeout for recognition start');
      
      // Start recognition with a small delay to prevent conflicts
      timeoutRef.current = setTimeout(() => {
        console.log('Timeout fired - about to start recognition');
        console.log('Recognition available:', !!recognitionRef.current);
        console.log('Already active:', isRecognitionActiveRef.current);
        
        if (recognitionRef.current && !isRecognitionActiveRef.current) {
          try {
            console.log('Calling recognition.start()...');
            recognitionRef.current.start();
            console.log('Speech recognition start() called successfully');
          } catch (error) {
            console.error('Error starting recognition:', error);
            setIsInitializing(false);
            setIsRecording(false);
            setIsListening(false);
          }
        } else {
          console.log('Cannot start recognition:', {
            hasRecognition: !!recognitionRef.current,
            isActive: isRecognitionActiveRef.current
          });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error in startRecording:', error);
      setIsInitializing(false);
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    
    // Clear any pending start timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsInitializing(false);

    if (recognitionRef.current && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Error stopping recognition:', error);
        // Reset state even if stop fails
        isRecognitionActiveRef.current = false;
        setIsRecording(false);
        setIsListening(false);
        setTranscript('');
      }
    } else {
      // Reset state immediately if recognition wasn't active
      isRecognitionActiveRef.current = false;
      setIsRecording(false);
      setIsListening(false);
      setTranscript('');
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;

    // Stop any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings for therapy
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to use a calming voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.lang.includes('en-')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!speechSupported) {
    return (
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Voice features require a modern browser with speech support. 
          Try Chrome, Edge, or Safari for the best experience.
        </p>
        <p className="text-xs text-yellow-600 mt-2">
          Browser info: {navigator.userAgent.substring(0, 50)}...
        </p>
      </div>
    );
  }

  // Add permission status display
  if (micPermission === 'denied') {
    return (
      <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 text-sm mb-2">
          Microphone access is required for voice chat.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
        >
          Refresh and Allow Microphone
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        {/* Voice Input Button */}
        <button
          onClick={() => {
            console.log('=== VOICE BUTTON CLICKED ===');
            console.log('Current state:', {
              isRecording,
              isInitializing,
              micPermission,
              speechSupported,
              hasRecognition: !!recognitionRef.current,
              isActive: isRecognitionActiveRef.current
            });
            
            if (isRecording) {
              console.log('Stopping recording...');
              stopRecording();
            } else {
              console.log('Starting recording...');
              startRecording();
            }
          }}
          disabled={micPermission === 'denied'}
          className={`p-3 rounded-full transition-all duration-200 ${
            micPermission === 'denied'
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : isRecording 
              ? 'bg-red-500 text-white shadow-lg scale-110' 
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
          }`}
          title={
            micPermission === 'denied' 
              ? 'Microphone access denied'
              : isRecording 
              ? 'Click to stop recording' 
              : 'Click to start recording'
          }
        >
          {micPermission === 'denied' ? (
            <MicOff className="h-5 w-5" />
          ) : isRecording ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </button>

        {/* Voice Output Control */}
        <button
          onClick={isSpeaking ? stopSpeaking : null}
          className={`p-2 rounded-full transition-all duration-200 ${
            isSpeaking 
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-400'
          }`}
          title={isSpeaking ? 'Stop speaking' : 'AI will speak responses'}
          disabled={!isSpeaking}
        >
          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center space-x-3 text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Listening...</span>
          
          {/* Microphone Level Indicator */}
          <div className="flex items-center space-x-1">
            <span className="text-xs">Level:</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-100"
                style={{ width: `${Math.min(micLevel * 2, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs">{Math.round(micLevel)}</span>
          </div>
        </div>
      )}

      {/* Live Transcript */}
      {transcript && (
        <div className="max-w-xs p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          {transcript}
        </div>
      )}

      {/* Troubleshooting Tip */}
      {isRecording && micLevel < 5 && (
        <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-2 py-1 max-w-xs text-center">
          💡 Speak louder or closer to your microphone. Level should be above 10.
        </div>
      )}
    </div>
  );

  // Expose speakText function for parent component
  VoiceChat.speakText = speakText;
}
