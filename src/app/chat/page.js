'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Heart, ArrowLeft, AlertTriangle, RotateCcw, Waves, Lightbulb, Users, Brain, BarChart3, FileText } from 'lucide-react';
import AccessibilitySettings from '../../components/AccessibilitySettings';
import CrisisIntervention from '../../components/CrisisIntervention';
import BreathingExercise from '../../components/BreathingExercise';
import EnvironmentalTherapy from '../../components/EnvironmentalTherapy';
import PersonaSelector from '../../components/PersonaSelector';
import WelcomeOnboarding from '../../components/WelcomeOnboarding';
import MemoryDashboard from '../../components/MemoryDashboard';
import MoodCheckIn from '../../components/MoodCheckIn';
import MoodDashboard from '../../components/MoodDashboardSimple';
import CrisisPredictionDashboard from '../../components/CrisisPredictionDashboard';
import CommunitySupport from '../../components/CommunitySupport';
import QuickActionsPanel from '../../components/QuickActionsPanel';
import ConversationInsights, { detectConversationMood } from '../../components/ConversationInsights';
import SessionSummary from '../../components/SessionSummary';
import { detectMoodFromConversation, getCurrentTimeOfDay, getMoodEmoji } from '../../utils/moodDetection';
import { loadSelectedPersona, saveSelectedPersona, getPersonaGreeting, getPersonaDisplayInfo, loadUserName, saveUserName, hasCompletedOnboarding, saveOnboardingComplete } from '../../utils/personas';
import { AdaptiveMemory, extractMemoryFromMessage } from '../../utils/adaptiveMemory';
import { CrisisPrediction } from '../../utils/crisisPrediction';
import analytics from '../../utils/analytics';

export default function ChatPage() {
  const [selectedPersona, setSelectedPersona] = useState('cass');
  const [userName, setUserName] = useState('');
  const [userMemory, setUserMemory] = useState(null);
  const [crisisPrediction, setCrisisPrediction] = useState(null);
  const [showWelcomeOnboarding, setShowWelcomeOnboarding] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [showMemoryDashboard, setShowMemoryDashboard] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showMoodDashboard, setShowMoodDashboard] = useState(false);
  const [showCrisisPredictionDashboard, setShowCrisisPredictionDashboard] = useState(false);
  const [showCommunitySupport, setShowCommunitySupport] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [conversationMood, setConversationMood] = useState('neutral');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false);
  const [currentCrisisLevel, setCurrentCrisisLevel] = useState('none');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showEnvironmentalTherapy, setShowEnvironmentalTherapy] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [connectionStatus, setConnectionStatus] = useState('connected'); // connected, disconnected, error
  const messagesEndRef = useRef(null);

  // Load conversation and persona from localStorage on component mount
  useEffect(() => {
    analytics.track('page_visit', { page: 'chat' });
    
    // Set session start time
    setSessionStartTime(Date.now());
    
    // Check if user has completed onboarding
    if (!hasCompletedOnboarding()) {
      setShowWelcomeOnboarding(true);
      return; // Don't load anything else until onboarding is complete
    }
    
    // Load saved user data
    const savedPersona = loadSelectedPersona();
    const savedUserName = loadUserName();
    setSelectedPersona(savedPersona);
    setUserName(savedUserName);
    
    // Initialize adaptive memory
    if (savedUserName) {
      const memory = new AdaptiveMemory(savedUserName);
      memory.incrementSessionCount();
      setUserMemory(memory);
      
      const crisisPredictor = new CrisisPrediction(savedUserName);
      setCrisisPrediction(crisisPredictor);
    }
    
    const savedMessages = localStorage.getItem('mindfulchat-session');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Only load if it's from today (to maintain session continuity but not persist indefinitely)
        const lastMessageTime = new Date(parsedMessages[parsedMessages.length - 1]?.savedAt || 0);
        const now = new Date();
        const sameDay = lastMessageTime.toDateString() === now.toDateString();
        
        if (sameDay && parsedMessages.length > 1) {
          setMessages(parsedMessages.map(msg => ({
            ...msg,
            savedAt: undefined // Remove savedAt property for display
          })));
          setSessionRestored(true);
          analytics.track('session_restored', { messageCount: parsedMessages.length });
        } else {
          // Start with persona greeting
          const greeting = {
            id: 1,
            text: getPersonaGreeting(savedPersona, savedUserName),
            isBot: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            persona: savedPersona
          };
          setMessages([greeting]);
        }
      } catch (error) {
        console.error('Error loading saved messages:', error);
        // Start with persona greeting on error
        const greeting = {
          id: 1,
          text: getPersonaGreeting(savedPersona, savedUserName),
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          persona: savedPersona
        };
        setMessages([greeting]);
      }
    } else {
      // Start with persona greeting for new sessions
      const greeting = {
        id: 1,
        text: getPersonaGreeting(savedPersona, savedUserName),
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: savedPersona
      };
      setMessages([greeting]);
    }
  }, []);

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the initial message
      const messagesToSave = messages.map(msg => ({
        ...msg,
        savedAt: new Date().toISOString()
      }));
      localStorage.setItem('mindfulchat-session', JSON.stringify(messagesToSave));
    }
  }, [messages]);

  // Track conversation mood changes
  useEffect(() => {
    if (messages.length > 0) {
      const detectedMood = detectConversationMood(messages);
      setConversationMood(detectedMood);
    }
  }, [messages]);

  // Add global keydown event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showBreathingExercise) setShowBreathingExercise(false);
        if (showCrisisIntervention) setShowCrisisIntervention(false);
        if (showMemoryDashboard) setShowMemoryDashboard(false);
        if (showMoodCheckIn) setShowMoodCheckIn(false);
        if (showMoodDashboard) setShowMoodDashboard(false);
        if (showPersonaSelector) setShowPersonaSelector(false);
        if (showEnvironmentalTherapy) setShowEnvironmentalTherapy(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showBreathingExercise, showCrisisIntervention, showMemoryDashboard, showMoodCheckIn, showMoodDashboard, showPersonaSelector, showEnvironmentalTherapy]);

  const handleOnboardingComplete = (data) => {
    const { userName: newUserName, selectedPersona: newPersona } = data;
    
    // Save to state and localStorage
    setUserName(newUserName);
    setSelectedPersona(newPersona);
    saveUserName(newUserName);
    saveSelectedPersona(newPersona);
    saveOnboardingComplete();
    
    // Initialize adaptive memory
    const memory = new AdaptiveMemory(newUserName);
    memory.incrementSessionCount();
    setUserMemory(memory);
    
    // Initialize crisis prediction
    const crisisPredictor = new CrisisPrediction(newUserName);
    setCrisisPrediction(crisisPredictor);
    
    // Close onboarding
    setShowWelcomeOnboarding(false);
    
    // Start with personalized greeting
    const greeting = {
      id: 1,
      text: getPersonaGreeting(newPersona, newUserName),
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: newPersona
    };
    setMessages([greeting]);
    
    analytics.track('onboarding_completed', { 
      userName: newUserName,
      selectedPersona: newPersona 
    });
  };

  const handlePersonaChange = (newPersonaId) => {
    setSelectedPersona(newPersonaId);
    saveSelectedPersona(newPersonaId);
    
    // Add a message about the persona change with user's name
    const personaInfo = getPersonaDisplayInfo(newPersonaId);
    const changeMessage = {
      id: messages.length + 1,
      text: `Hi ${userName}! I'm ${personaInfo.name}, ${personaInfo.title}. I'll be supporting you from here on. ${getPersonaGreeting(newPersonaId, userName).split('.').slice(1).join('.').trim()}`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: newPersonaId,
      isPersonaChange: true
    };
    
    setMessages(prev => [...prev, changeMessage]);
    analytics.track('persona_changed', { 
      previousPersona: selectedPersona,
      newPersona: newPersonaId,
      userName: userName 
    });
  };

  // Handle suggestions from conversation insights
  const handleInsightSuggestion = (suggestionType) => {
    switch (suggestionType) {
      case 'breathing':
        setShowBreathingExercise(true);
        break;
      case 'work-coping':
        handleSendMessage("I'd like some strategies for dealing with work stress");
        break;
      case 'celebrate':
        analytics.track('mood_improvement_celebrated');
        break;
      case 'break':
        setShowBreathingExercise(true);
        break;
      case 'community':
        setShowCommunitySupport(true);
        break;
      default:
        console.log('Unknown suggestion type:', suggestionType);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend) return;

    const newMessage = {
      id: messages.length + 1,
      text: textToSend,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages with the new user message
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    const currentInput = textToSend;
    setInputText('');
    setIsTyping(true);

    // Track message sending
    analytics.track('message_sent', { 
      messageLength: currentInput.length,
      messageCount: updatedMessages.length,
      inputMethod: 'text'
    });

    // Extract memory from user message
    if (userMemory && userName) {
      extractMemoryFromMessage(currentInput, userName);
    }

    // Analyze for crisis prediction
    if (crisisPrediction) {
      const riskAnalysis = crisisPrediction.analyzeMessage(currentInput);
      if (riskAnalysis.riskLevel >= 2) {
        analytics.track('high_risk_detected', {
          riskLevel: riskAnalysis.riskLevel,
          keywords: riskAnalysis.matchedKeywords.length
        });
      }
    }

    try {
      // Get memory context for AI
      const memoryContext = userMemory ? userMemory.getMemorySummary() : '';
      
      // Call our OpenAI API with the complete conversation history including the new message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages, // Send the updated conversation history
          userMessage: currentInput,
          selectedPersona: selectedPersona, // Include selected persona
          userName: userName, // Include user name for personalization
          memoryContext: memoryContext // Include memory context
        }),
      });

      if (!response.ok) {
        setConnectionStatus('error');
        throw new Error(`Failed to get response: ${response.status}`);
      }

      setConnectionStatus('connected');
      const data = await response.json();
      
      // Check for crisis intervention needs
      if (data.requiresIntervention) {
        setCurrentCrisisLevel(data.crisisLevel);
        setShowCrisisIntervention(true);
        analytics.track('crisis_intervention', { 
          crisisLevel: data.crisisLevel,
          matchedKeywords: data.matchedKeywords?.length || 0
        });
      }
      
      const botResponse = {
        id: updatedMessages.length + 1,
        text: data.message,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: data.isCrisis || false,
        crisisLevel: data.crisisLevel || 'none',
        fallback: data.fallback || false
      };
      
      const finalMessages = [...updatedMessages, botResponse];
      setMessages(finalMessages);
      
      // Extract memory from AI response as well
      if (userMemory && userName) {
        extractMemoryFromMessage(data.message, userName);
      }
      
      // Detect mood for environmental therapy
      const detectedMood = detectMoodFromConversation(finalMessages);
      setCurrentMood(detectedMood);
      
      // Auto-suggest environmental therapy for certain moods after a few messages
      if ((detectedMood === 'anxious' || detectedMood === 'stressed' || detectedMood === 'depressed' || detectedMood === 'low') 
          && finalMessages.length >= 6 && !sessionRestored) {
        // Show suggestion after a brief delay
        setTimeout(() => {
          analytics.track('environmental_therapy_suggested', { mood: detectedMood });
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionStatus('error');
      
      // Fallback response if API fails
      const fallbackResponse = {
        id: updatedMessages.length + 1,
        text: "I'm experiencing some technical difficulties right now. If you're in crisis, please call 116 123 (Samaritans, UK - free 24/7) or 988 (US). I'm here to listen - can you tell me more about what's on your mind?",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fallback: true
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    // Add Escape key to close modals
    if (e.key === 'Escape') {
      if (showBreathingExercise) setShowBreathingExercise(false);
      if (showCrisisIntervention) setShowCrisisIntervention(false);
      if (showMemoryDashboard) setShowMemoryDashboard(false);
      if (showMoodCheckIn) setShowMoodCheckIn(false);
      if (showMoodDashboard) setShowMoodDashboard(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('mindfulchat-session');
    const greeting = {
      id: 1,
      text: getPersonaGreeting(selectedPersona, userName),
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: selectedPersona
    };
    setMessages([greeting]);
    setSessionRestored(false);
    setShowCrisisIntervention(false);
    setCurrentCrisisLevel('none');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base">MindfulChat Therapy Bot</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span className="hidden sm:inline">
                {connectionStatus === 'connected' ? 'Anonymous Session' :
                 connectionStatus === 'error' ? 'Connection Issues' : 'Connecting...'}
              </span>
            </div>
            
            {/* Mobile: Two-row layout, Desktop: Single row */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:flex md:flex-wrap items-center gap-1 md:gap-2 max-w-full overflow-hidden">
            <button
              onClick={() => {
                setShowBreathingExercise(true);
                analytics.track('breathing_exercise_started');
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors min-w-0"
              title="Start breathing exercise"
            >
              <Waves className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">Breathe</span>
            </button>
            <button
              onClick={() => {
                setShowEnvironmentalTherapy(true);
                analytics.track('environmental_therapy_started', { mood: currentMood });
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors min-w-0"
              title={`Optimize your environment for ${currentMood} mood`}
            >
              <Lightbulb className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">Space</span>
            </button>
            <button
              onClick={() => {
                setShowPersonaSelector(true);
                analytics.track('persona_selector_opened', { currentPersona: selectedPersona });
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors min-w-0"
              title={`Current: ${getPersonaDisplayInfo(selectedPersona).name}`}
            >
              <Users className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">{getPersonaDisplayInfo(selectedPersona).name}</span>
            </button>
            <button
              onClick={() => {
                setShowMemoryDashboard(true);
                analytics.track('memory_dashboard_opened');
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors min-w-0"
              title="View therapeutic journey and insights"
            >
              <Brain className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">Journey</span>
            </button>
            <button
              onClick={() => {
                console.log('Mood button clicked!');
                console.log('userName:', userName);
                console.log('showMoodDashboard before:', showMoodDashboard);
                setShowMoodDashboard(true);
                console.log('setShowMoodDashboard(true) called');
                analytics.track('mood_dashboard_opened');
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors min-w-0"
              title="View mood tracking and insights"
            >
              <BarChart3 className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">Mood</span>
            </button>
            <button
              onClick={() => {
                setShowCrisisPredictionDashboard(true);
                analytics.track('crisis_prediction_dashboard_opened');
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors min-w-0"
              title="View wellness monitoring and crisis prediction"
            >
              <Brain className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">Wellness</span>
            </button>
            <button
              onClick={() => {
                setShowSessionSummary(true);
                analytics.track('session_summary_opened');
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors min-w-0"
              title="View session summary and insights"
              disabled={messages.length <= 1}
            >
              <FileText className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">Summary</span>
            </button>
            <button
              onClick={() => {
                clearSession();
                analytics.track('session_cleared');
              }}
              className="flex items-center justify-center md:justify-start space-x-1 px-1 md:px-2 lg:px-3 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors min-w-0"
              title="Start a fresh conversation"
            >
              <RotateCcw className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
              <span className="hidden lg:inline truncate">New</span>
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Warning */}
      <div className="bg-red-50 border-b border-red-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-start sm:items-center space-x-2 text-xs sm:text-sm text-red-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Crisis Support:</strong> If you're in immediate danger, call emergency services (999/112). 
            <span className="hidden sm:inline"> UK: </span>
            <span className="sm:hidden"><br />UK: </span>
            <strong>116 123</strong> (Samaritans, free 24/7)
            <span className="hidden sm:inline"> | US: </span>
            <span className="sm:hidden"><br />US: </span>
            <strong>988</strong>
          </span>
        </div>
      </div>

      {/* Session Restored Indicator */}
      {sessionRestored && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-start sm:items-center space-x-2 text-xs sm:text-sm text-blue-800">
            <Heart className="h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Session Continued:</strong> I remember our previous conversation from today. 
              <span className="hidden sm:inline">You can start a new session anytime using the button above.</span>
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Conversation Insights */}
          <ConversationInsights
            messages={messages}
            onSuggestion={handleInsightSuggestion}
            currentMood={conversationMood}
          />
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                  message.isBot
                    ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className={`text-xs ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                    {message.timestamp}
                  </p>
                  <div className="flex items-center space-x-2">
                    {message.isBot && message.fallback && (
                      <span className="text-xs text-orange-500 font-medium">
                        Basic Response
                      </span>
                    )}
                    {message.isBot && message.isSafetyCheck && (
                      <span className="text-xs text-green-500 font-medium">
                        Safety Check
                      </span>
                    )}
                    {message.isBot && message.isBreathingFollowUp && (
                      <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-1 rounded">
                        Breathing Follow-up
                      </span>
                    )}
                    {message.isBot && message.crisisLevel === 'immediate' && (
                      <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
                        Critical Alert
                      </span>
                    )}
                    {message.isBot && message.crisisLevel === 'severe' && (
                      <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">
                        Crisis Support
                      </span>
                    )}
                    {message.isBot && message.crisisLevel === 'moderate' && (
                      <span className="text-xs text-orange-500 font-medium bg-orange-50 px-2 py-1 rounded">
                        Support Alert
                      </span>
                    )}
                    {message.isBot && message.isCrisis && !message.crisisLevel && (
                      <span className="text-xs text-red-500 font-medium">
                        Crisis Support
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind... (Enter to send, Shift+Enter for new line)"
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              rows="2"
              disabled={isTyping}
              maxLength={2000}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-2 gap-2">
            <p className="text-xs text-gray-500 leading-relaxed">
              This is an AI therapy bot. While it can provide support and coping strategies, 
              it's not a replacement for professional mental health care.
            </p>
            <span className="text-xs text-gray-400 ml-auto sm:ml-0">
              {inputText.length}/2000
            </span>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <AccessibilitySettings />

      {/* Crisis Intervention Modal */}
      {showCrisisIntervention && (
        <CrisisIntervention 
          crisisLevel={currentCrisisLevel}
          onClose={() => setShowCrisisIntervention(false)}
          onStartBreathing={() => {
            setShowCrisisIntervention(false);
            setShowBreathingExercise(true);
          }}
          onConfirmSafety={() => {
            setShowCrisisIntervention(false);
            // Optionally add a safety confirmation message
            const safetyMessage = {
              id: messages.length + 1,
              text: "Thank you for confirming your safety. I'm here to continue supporting you through this difficult time. How would you like to proceed with our conversation?",
              isBot: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSafetyCheck: true
            };
            setMessages(prev => [...prev, safetyMessage]);
          }}
        />
      )}

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <BreathingExercise 
          isOpen={showBreathingExercise}
          onClose={() => {
            setShowBreathingExercise(false);
            // Add a follow-up message after breathing exercise
            const breathingMessage = {
              id: messages.length + 1,
              text: "I hope that breathing exercise helped you feel a bit more centered. Sometimes taking a moment to focus on our breath can create space between us and overwhelming feelings. How are you feeling now?",
              isBot: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isBreathingFollowUp: true
            };
            setMessages(prev => [...prev, breathingMessage]);
          }}
        />
      )}

      {/* Environmental Therapy Modal */}
      {showEnvironmentalTherapy && (
        <EnvironmentalTherapy 
          isOpen={showEnvironmentalTherapy}
          onClose={() => {
            setShowEnvironmentalTherapy(false);
            // Add a follow-up message after environmental therapy
            const environmentMessage = {
              id: messages.length + 1,
              text: `I hope those environmental suggestions help create a more supportive space for you. Our physical environment can have a profound impact on our emotional well-being. Even small changes to lighting, sound, or organization can shift how we feel. Did any of those suggestions resonate with you?`,
              isBot: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isEnvironmentFollowUp: true
            };
            setMessages(prev => [...prev, environmentMessage]);
          }}
          currentMood={currentMood}
          timeOfDay={getCurrentTimeOfDay()}
        />
      )}

      {/* Persona Selector Modal */}
      {showPersonaSelector && (
        <PersonaSelector 
          isOpen={showPersonaSelector}
          onClose={() => setShowPersonaSelector(false)}
          currentPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
        />
      )}

      {/* Memory Dashboard Modal */}
      {showMemoryDashboard && (
        <MemoryDashboard 
          isOpen={showMemoryDashboard}
          onClose={() => setShowMemoryDashboard(false)}
          userMemory={userMemory}
          userName={userName}
        />
      )}

      {/* Mood Check-in Modal */}
      {showMoodCheckIn && (
        <MoodCheckIn 
          isOpen={showMoodCheckIn}
          onClose={() => setShowMoodCheckIn(false)}
          userName={userName}
          onMoodLogged={(moodData) => {
            analytics.track('mood_logged', { mood: moodData.mood, energy: moodData.energy, stress: moodData.stress });
            // Add a supportive message after mood logging
            const supportMessage = {
              id: messages.length + 1,
              text: `Thank you for checking in! I see you rated your mood as ${moodData.mood}/10. Taking time to reflect on how you're feeling is an important step in managing your mental health. How would you like to explore these feelings together?`,
              isBot: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMoodFollowUp: true
            };
            setMessages(prev => [...prev, supportMessage]);
          }}
        />
      )}

      {/* Mood Dashboard Modal */}
      {showMoodDashboard && (
        <MoodDashboard 
          isOpen={showMoodDashboard}
          onClose={() => {
            console.log('Closing mood dashboard');
            setShowMoodDashboard(false);
          }}
          userName={userName}
          onOpenCheckIn={() => {
            setShowMoodDashboard(false);
            setShowMoodCheckIn(true);
          }}
        />
      )}

      {/* Welcome Onboarding */}
      {showWelcomeOnboarding && (
        <WelcomeOnboarding 
          isOpen={showWelcomeOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}

      {/* Crisis Prediction Dashboard */}
      {showCrisisPredictionDashboard && (
        <CrisisPredictionDashboard
          isOpen={showCrisisPredictionDashboard}
          onClose={() => setShowCrisisPredictionDashboard(false)}
          userName={userName}
        />
      )}

      {/* Community Support */}
      {showCommunitySupport && (
        <CommunitySupport
          isOpen={showCommunitySupport}
          onClose={() => setShowCommunitySupport(false)}
          userName={userName}
        />
      )}

      {/* Quick Actions Panel */}
      <QuickActionsPanel
        onBreathingExercise={() => setShowBreathingExercise(true)}
        onMoodCheck={() => setShowMoodCheckIn(true)}
        onCrisisHelp={() => setShowCrisisIntervention(true)}
        onEnvironmentalTherapy={() => setShowEnvironmentalTherapy(true)}
        onCommunitySupport={() => setShowCommunitySupport(true)}
        onPersonaSwitch={() => setShowPersonaSelector(true)}
        isVisible={!showWelcomeOnboarding && messages.length > 1}
      />

      {/* Session Summary */}
      {showSessionSummary && (
        <SessionSummary
          messages={messages}
          isVisible={showSessionSummary}
          onClose={() => setShowSessionSummary(false)}
          userName={userName}
          selectedPersona={selectedPersona}
          sessionStartTime={sessionStartTime}
        />
      )}
    </div>
  );
}
