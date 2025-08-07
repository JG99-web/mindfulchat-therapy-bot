'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Heart, Brain, X } from 'lucide-react';

export default function ConversationInsights({ messages, onSuggestion, currentMood }) {
  const [insights, setInsights] = useState([]);
  const [dismissedInsights, setDismissedInsights] = useState(new Set());

  useEffect(() => {
    if (messages.length > 0) {
      const newInsights = analyzeConversation(messages, currentMood);
      setInsights(newInsights);
    }
  }, [messages, currentMood]);

  const analyzeConversation = (messages, mood) => {
    const insights = [];
    const recentMessages = messages.slice(-6); // Last 6 messages
    const userMessages = recentMessages.filter(m => m.sender === 'user');
    const conversationText = userMessages.map(m => m.text.toLowerCase()).join(' ');

    // Anxiety detection
    if (conversationText.includes('anxious') || conversationText.includes('worried') || conversationText.includes('stressed')) {
      insights.push({
        id: 'breathing-suggestion',
        type: 'suggestion',
        icon: Heart,
        title: 'Feeling Anxious?',
        description: 'I noticed you mentioned feeling anxious. A quick breathing exercise might help.',
        action: () => onSuggestion('breathing'),
        color: 'bg-blue-50 border-blue-200 text-blue-700'
      });
    }

    // Work stress detection
    if (conversationText.includes('work') || conversationText.includes('job') || conversationText.includes('boss')) {
      insights.push({
        id: 'work-stress',
        type: 'insight',
        icon: Brain,
        title: 'Work Stress Patterns',
        description: 'Work-related stress is common. Consider setting boundaries or discussing workplace coping strategies.',
        action: () => onSuggestion('work-coping'),
        color: 'bg-purple-50 border-purple-200 text-purple-700'
      });
    }

    // Mood improvement detection
    if (mood === 'positive' && messages.length > 8) {
      insights.push({
        id: 'mood-improvement',
        type: 'celebration',
        icon: TrendingUp,
        title: 'Positive Progress!',
        description: 'Your mood seems to be improving through our conversation. That\'s wonderful!',
        action: () => onSuggestion('celebrate'),
        color: 'bg-green-50 border-green-200 text-green-700'
      });
    }

    // Long conversation suggestion
    if (messages.length > 20) {
      insights.push({
        id: 'break-suggestion',
        type: 'wellness',
        icon: Heart,
        title: 'Take a Moment',
        description: 'We\'ve been talking for a while. Consider taking a short break or doing a quick mindfulness exercise.',
        action: () => onSuggestion('break'),
        color: 'bg-orange-50 border-orange-200 text-orange-700'
      });
    }

    // Social connection patterns
    if (conversationText.includes('lonely') || conversationText.includes('isolated') || conversationText.includes('alone')) {
      insights.push({
        id: 'social-connection',
        type: 'resource',
        icon: Heart,
        title: 'Connection Matters',
        description: 'Feeling isolated is tough. Our community support might help you connect with others who understand.',
        action: () => onSuggestion('community'),
        color: 'bg-pink-50 border-pink-200 text-pink-700'
      });
    }

    // Filter out dismissed insights
    return insights.filter(insight => !dismissedInsights.has(insight.id));
  };

  const dismissInsight = (insightId) => {
    setDismissedInsights(prev => new Set([...prev, insightId]));
  };

  if (insights.length === 0) return null;

  return (
    <div className="mb-4 space-y-2">
      {insights.slice(0, 2).map((insight) => { // Show max 2 insights at once
        const IconComponent = insight.icon;
        return (
          <div
            key={insight.id}
            className={`p-3 rounded-lg border-l-4 ${insight.color} relative group`}
          >
            <button
              onClick={() => dismissInsight(insight.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
              aria-label="Dismiss insight"
            >
              <X className="h-3 w-3" />
            </button>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <p className="text-sm opacity-90 mt-1">{insight.description}</p>
                {insight.action && (
                  <button
                    onClick={insight.action}
                    className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
                  >
                    Try this →
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export utility function for external mood detection
export const detectConversationMood = (messages) => {
  const userMessages = messages.filter(m => m.sender === 'user');
  const recentText = userMessages.slice(-3).map(m => m.text.toLowerCase()).join(' ');
  
  const positiveWords = ['better', 'good', 'happy', 'grateful', 'thankful', 'hopeful', 'improving'];
  const negativeWords = ['worse', 'terrible', 'awful', 'hopeless', 'devastating', 'unbearable'];
  const anxiousWords = ['anxious', 'worried', 'nervous', 'panicked', 'stressed', 'overwhelmed'];
  
  const positiveScore = positiveWords.filter(word => recentText.includes(word)).length;
  const negativeScore = negativeWords.filter(word => recentText.includes(word)).length;
  const anxiousScore = anxiousWords.filter(word => recentText.includes(word)).length;
  
  if (positiveScore > negativeScore && positiveScore > anxiousScore) return 'positive';
  if (anxiousScore > 0) return 'anxious';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
};
