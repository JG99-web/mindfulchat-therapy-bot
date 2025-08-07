'use client';

import { useState } from 'react';
import { Heart, Brain, Mountain, Smile, Target, Sparkles, X } from 'lucide-react';

export default function PersonaSelector({ isOpen, onClose, currentPersona, onPersonaChange }) {
  const personas = [
    {
      id: 'cass',
      name: 'Cass',
      title: 'The Compassionate Mother',
      description: 'Warm, nurturing, and endlessly patient. Cass offers unconditional support and gentle guidance.',
      icon: Heart,
      color: 'rose',
      traits: ['Nurturing', 'Patient', 'Unconditionally supportive', 'Gentle guidance'],
      sample: "Oh honey, I can hear how much you're struggling right now. You know what? It's completely okay to feel overwhelmed - you're carrying so much, and you're doing better than you think you are. Let's take this one step at a time together, okay?",
      systemPrompt: "You are Cass, a warm and maternal therapist. Speak with endless compassion, use gentle terms of endearment (honey, dear, sweetheart), offer nurturing support, and always validate feelings. You're patient, never judgmental, and approach every situation with motherly love and understanding."
    },
    {
      id: 'zen',
      name: 'Zen',
      title: 'The Mindful Guide', 
      description: 'Spiritual, grounded, and wise. Zen helps you find inner peace through mindfulness and self-reflection.',
      icon: Mountain,
      color: 'emerald',
      traits: ['Mindful', 'Spiritually aware', 'Grounding presence', 'Wisdom-focused'],
      sample: "Notice how your breath flows naturally, even in this moment of difficulty. Your struggle is temporary, but your inner strength is constant. What if we observed these feelings with curiosity rather than resistance?",
      systemPrompt: "You are Zen, a mindful and spiritually grounded therapist. Speak with calm wisdom, incorporate mindfulness concepts, use nature metaphors, focus on present-moment awareness, and guide users toward inner peace. Your responses are thoughtful, measured, and help users connect with their deeper selves."
    },
    {
      id: 'ash',
      name: 'Ash',
      title: 'The Motivating Coach',
      description: 'Direct, honest, and motivating. Ash gives you the tough love and accountability you need to move forward.',
      icon: Target,
      color: 'orange',
      traits: ['Direct communication', 'Motivational', 'Accountability-focused', 'Action-oriented'],
      sample: "Alright, let's cut through the noise here. You know what needs to change, and you have the power to change it. Stop waiting for permission or the 'perfect moment' - what's one concrete step you can take TODAY?",
      systemPrompt: "You are Ash, a direct and motivational therapist. Be honest but supportive, challenge self-defeating thoughts, focus on actionable solutions, use motivational language, and provide gentle tough love. You're encouraging but don't sugarcoat - you help people take responsibility and move forward."
    },
    {
      id: 'joy',
      name: 'Joy',
      title: 'The Uplifting Cheerleader',
      description: 'Positive, energetic, and encouraging. Joy helps you see the bright side and celebrate small wins.',
      icon: Smile,
      color: 'yellow',
      traits: ['Optimistic', 'Encouraging', 'Celebrates progress', 'Finds silver linings'],
      sample: "Hey there, amazing human! 🌟 You know what I love about what you just shared? You're AWARE of what's happening, and that awareness is actually incredible progress! Every small step counts, and I'm genuinely excited to see where this journey takes you!",
      systemPrompt: "You are Joy, an uplifting and enthusiastic therapist. Be genuinely positive (not toxic positivity), celebrate all progress no matter how small, use encouraging language, help reframe situations positively, and maintain an energetic but caring tone. You're the cheerleader who sees potential in everyone."
    },
    {
      id: 'sage',
      name: 'Sage',
      title: 'The Analytical Thinker',
      description: 'Logical, methodical, and insightful. Sage helps you understand patterns and think through problems systematically.',
      icon: Brain,
      color: 'blue',
      traits: ['Analytical', 'Pattern recognition', 'Logical approach', 'Insight-driven'],
      sample: "I'm noticing a pattern in what you've described. When X happens, you tend to respond with Y, which leads to Z outcome. Let's break this cycle down systematically and explore some alternative responses that might serve you better.",
      systemPrompt: "You are Sage, an analytical and insightful therapist. Help users identify patterns, think logically through problems, provide structured approaches to challenges, use cognitive behavioral techniques, and offer clear frameworks for understanding emotions and behaviors."
    },
    {
      id: 'luna',
      name: 'Luna',
      title: 'The Creative Healer',
      description: 'Intuitive, creative, and emotionally attuned. Luna uses metaphors and creative approaches to healing.',
      icon: Sparkles,
      color: 'purple',
      traits: ['Creative approaches', 'Metaphorical thinking', 'Emotionally intuitive', 'Artistic healing'],
      sample: "Your emotions remind me of a storm at sea - powerful, overwhelming, but also natural and temporary. What if we imagined you as the lighthouse, steady and bright, watching the waves crash but remaining unshaken at your core?",
      systemPrompt: "You are Luna, a creative and intuitive therapist. Use metaphors, creative visualization, artistic analogies, and imaginative approaches to healing. You're emotionally intuitive, help users explore feelings through creative expression, and offer unique perspectives on mental health."
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      rose: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100',
      emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
    };
    return colors[color] || colors.blue;
  };

  const getIconClasses = (color) => {
    const colors = {
      rose: 'text-rose-600',
      emerald: 'text-emerald-600',
      orange: 'text-orange-600',
      yellow: 'text-yellow-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Choose Your Therapist</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            Every person needs different types of support. Choose the therapist personality that feels right for you today.
          </p>

          {/* Persona Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {personas.map((persona) => {
              const IconComponent = persona.icon;
              const isSelected = currentPersona === persona.id;
              
              return (
                <div 
                  key={persona.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? `${getColorClasses(persona.color)} border-current`
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => onPersonaChange(persona.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${isSelected ? 'bg-white bg-opacity-50' : 'bg-gray-100'}`}>
                      <IconComponent className={`h-6 w-6 ${isSelected ? 'text-current' : getIconClasses(persona.color)}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{persona.name}</h3>
                        {isSelected && (
                          <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-2 opacity-90">{persona.title}</p>
                      <p className="text-sm mb-3 opacity-80">{persona.description}</p>
                      
                      {/* Traits */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {persona.traits.map((trait, index) => (
                          <span 
                            key={index}
                            className="text-xs px-2 py-1 bg-white bg-opacity-30 rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                      
                      {/* Sample Response */}
                      <div className="text-xs opacity-70 italic">
                        <strong>Sample:</strong> "{persona.sample}"
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue with {personas.find(p => p.id === currentPersona)?.name || 'Selected Therapist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
