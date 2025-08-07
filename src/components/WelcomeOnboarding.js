'use client';

import { useState } from 'react';
import { Heart, ArrowRight, Users, Sparkles } from 'lucide-react';

export default function WelcomeOnboarding({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('');

  const personas = [
    {
      id: 'cass',
      name: 'Cass',
      title: 'The Compassionate Mother',
      description: 'Warm, nurturing, and endlessly patient. Perfect for when you need unconditional support.',
      color: 'rose',
      emoji: '🤗',
      sample: "Oh honey, I'm so glad you're here. Whatever's on your heart, I'm here to listen with love."
    },
    {
      id: 'zen',
      name: 'Zen',
      title: 'The Mindful Guide', 
      description: 'Spiritual, grounded, and wise. Great for finding inner peace and mindfulness.',
      color: 'emerald',
      emoji: '🧘‍♀️',
      sample: "Welcome. Take a gentle breath with me. In this moment, you are exactly where you need to be."
    },
    {
      id: 'ash',
      name: 'Ash',
      title: 'The Motivating Coach',
      description: 'Direct, honest, and motivating. Choose when you need accountability and action.',
      color: 'orange',
      emoji: '💪',
      sample: "Hey there! Ready to tackle whatever's holding you back? Let's get real and make some progress."
    },
    {
      id: 'joy',
      name: 'Joy',
      title: 'The Uplifting Cheerleader',
      description: 'Positive, energetic, and encouraging. Perfect for lifting your spirits.',
      color: 'yellow',
      emoji: '🌟',
      sample: "Hi there, amazing human! I can already tell you're brave for being here. Let's celebrate that!"
    },
    {
      id: 'sage',
      name: 'Sage',
      title: 'The Analytical Thinker',
      description: 'Logical, methodical, and insightful. Ideal for working through complex problems.',
      color: 'blue',
      emoji: '🧠',
      sample: "Hello. I'm here to help you think through this systematically and find clear solutions."
    },
    {
      id: 'luna',
      name: 'Luna',
      title: 'The Creative Healer',
      description: 'Intuitive, creative, and emotionally attuned. Great for exploring feelings creatively.',
      color: 'purple',
      emoji: '✨',
      sample: "Hello, beautiful soul. Your story is like a work of art, and I'm here to help you paint it."
    }
  ];

  const getColorClasses = (color, isSelected = false) => {
    const colors = {
      rose: isSelected ? 'bg-rose-100 border-rose-300 text-rose-800' : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
      emerald: isSelected ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      orange: isSelected ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      yellow: isSelected ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
      blue: isSelected ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      purple: isSelected ? 'bg-purple-100 border-purple-300 text-purple-800' : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
    };
    return colors[color] || colors.blue;
  };

  const handleComplete = () => {
    if (userName.trim() && selectedPersona) {
      onComplete({
        userName: userName.trim(),
        selectedPersona: selectedPersona
      });
    }
  };

  const selectedPersonaData = personas.find(p => p.id === selectedPersona);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Step 1: Welcome & Name Collection */}
        {currentStep === 1 && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <Heart className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MindfulChat</h1>
              <p className="text-lg text-gray-600">
                Your safe, anonymous space for mental health support
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  What would you like to be called? (First name or nickname)
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  placeholder="e.g., Alex, Sam, Jordan..."
                  maxLength={20}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userName.trim()) {
                      setCurrentStep(2);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This helps our AI feel more personal. Your privacy remains completely protected.
                </p>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!userName.trim()}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <span>Choose Your Therapist</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Therapist Selection */}
        {currentStep === 2 && (
          <div className="p-8">
            <div className="text-center mb-8">
              <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hi {userName}! Choose Your AI Therapist
              </h2>
              <p className="text-gray-600">
                Each therapist has a unique personality and approach. Pick the one that feels right for you today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {personas.map((persona) => (
                <div 
                  key={persona.id}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${getColorClasses(persona.color, selectedPersona === persona.id)}`}
                  onClick={() => setSelectedPersona(persona.id)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{persona.emoji}</div>
                    <h3 className="font-semibold text-lg mb-1">{persona.name}</h3>
                    <p className="text-sm font-medium mb-2 opacity-90">{persona.title}</p>
                    <p className="text-xs mb-3 opacity-80">{persona.description}</p>
                    
                    {selectedPersona === persona.id && (
                      <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                        <p className="text-xs italic">
                          <strong>Sample:</strong> "{persona.sample}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back
              </button>
              
              <button
                onClick={handleComplete}
                disabled={!selectedPersona}
                className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span>Start Talking with {selectedPersonaData?.name || 'Therapist'}</span>
                <Sparkles className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
