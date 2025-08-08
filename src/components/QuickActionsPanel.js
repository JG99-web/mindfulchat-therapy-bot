'use client';

import { useState } from 'react';
import { Waves, Heart, AlertTriangle, Volume2, Users, RotateCcw } from 'lucide-react';

export default function QuickActionsPanel({ 
  onBreathingExercise, 
  onMoodCheck, 
  onCrisisHelp, 
  onEnvironmentalTherapy,
  onPersonaSwitch,
  isVisible = true 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    { 
      id: 'breathing', 
      icon: Waves, 
      label: 'Breathing Exercise', 
      action: onBreathingExercise,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      description: 'Quick calm'
    },
    { 
      id: 'mood', 
      icon: Heart, 
      label: 'Mood Check', 
      action: onMoodCheck,
      color: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      description: 'How are you?'
    },
    { 
      id: 'crisis', 
      icon: AlertTriangle, 
      label: 'Crisis Help', 
      action: onCrisisHelp,
      color: 'bg-red-100 text-red-600 hover:bg-red-200',
      description: 'Need help now'
    },
    { 
      id: 'sounds', 
      icon: Volume2, 
      label: 'Calming Sounds', 
      action: onEnvironmentalTherapy,
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
      description: 'Peaceful audio'
    },
    { 
      id: 'therapist', 
      icon: RotateCcw, 
      label: 'Switch Therapist', 
      action: onPersonaSwitch,
      color: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
      description: 'Try different style'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed right-2 sm:right-4 lg:right-20 bottom-4 z-40">
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 ${
        isExpanded ? 'w-56 sm:w-64' : 'w-12'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-12 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Toggle quick actions"
        >
          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ⚡
          </div>
        </button>

        {/* Actions List */}
        {isExpanded && (
          <div className="p-3 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setIsExpanded(false); // Auto-collapse after action
                    }}
                    className={`w-full flex items-center p-2 rounded-lg transition-colors ${action.color}`}
                  >
                    <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{action.label}</div>
                      <div className="text-xs opacity-75 truncate">{action.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Quick tip */}
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">
                💡 These tools are always here when you need them during your conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
