'use client';

import { useState, useEffect } from 'react';
import { Sun, Cloud, Moon, Lightbulb, Volume2, Thermometer, Eye, Palette, X } from 'lucide-react';

export default function EnvironmentalTherapy({ isOpen, onClose, currentMood, timeOfDay }) {
  const [environmentData, setEnvironmentData] = useState({
    weather: null,
    timeOfDay: timeOfDay || 'unknown',
    lighting: 'unknown',
    temperature: 'comfortable'
  });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      detectEnvironment();
      generateSuggestions();
    }
  }, [isOpen, currentMood]);

  const detectEnvironment = async () => {
    try {
      // Get basic time and weather info
      const now = new Date();
      const hour = now.getHours();
      
      let timeOfDay = 'morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
      else if (hour >= 21 || hour < 6) timeOfDay = 'night';

      // Try to get weather (using a free API)
      let weather = null;
      try {
        // Using a simple IP-based weather API (no location permission needed)
        const weatherResponse = await fetch('http://ip-api.com/json/');
        const locationData = await weatherResponse.json();
        
        // You could integrate with OpenWeatherMap or similar here
        // For now, we'll simulate weather based on time and create suggestions
        weather = {
          condition: 'partly_cloudy', // This would come from real API
          temperature: 20, // Celsius
          city: locationData.city || 'Unknown'
        };
      } catch (error) {
        console.log('Weather detection failed, using defaults');
      }

      setEnvironmentData({
        weather,
        timeOfDay,
        lighting: hour < 8 || hour > 18 ? 'dim' : 'natural',
        temperature: 'comfortable'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Environment detection failed:', error);
      setLoading(false);
    }
  };

  const generateSuggestions = () => {
    const suggestions = [];

    // Mood-based environmental suggestions
    if (currentMood === 'anxious' || currentMood === 'stressed') {
      suggestions.push({
        category: 'lighting',
        icon: Lightbulb,
        title: 'Calming Lighting',
        description: 'Dim harsh lights and use warm, soft lighting',
        actions: [
          'Turn off overhead lights',
          'Use lamps with warm bulbs (2700K)',
          'Try candles or salt lamps',
          'Close blinds to reduce harsh sunlight'
        ],
        priority: 'high',
        color: 'blue'
      });

      suggestions.push({
        category: 'sound',
        icon: Volume2,
        title: 'Sound Environment',
        description: 'Create a calming audio atmosphere',
        actions: [
          'Play nature sounds (rain, ocean waves)',
          'Use white noise or brown noise',
          'Try binaural beats (40Hz for focus, 6Hz for calm)',
          'Reduce background noise and distractions'
        ],
        priority: 'medium',
        color: 'purple'
      });

      suggestions.push({
        category: 'space',
        icon: Eye,
        title: 'Visual Calm',
        description: 'Organize your immediate visual space',
        actions: [
          'Clear clutter from your immediate view',
          'Face a window or natural view if possible',
          'Remove stimulating colors from view',
          'Add one calming object (plant, smooth stone)'
        ],
        priority: 'medium',
        color: 'green'
      });
    }

    if (currentMood === 'depressed' || currentMood === 'low') {
      suggestions.push({
        category: 'lighting',
        icon: Sun,
        title: 'Energizing Light',
        description: 'Increase bright, natural light exposure',
        actions: [
          'Open all blinds and curtains',
          'Sit near a window for 10 minutes',
          'Use bright white light (5000K+)',
          'Consider a light therapy lamp'
        ],
        priority: 'high',
        color: 'yellow'
      });

      suggestions.push({
        category: 'color',
        icon: Palette,
        title: 'Uplifting Colors',
        description: 'Surround yourself with energizing colors',
        actions: [
          'Add warm colors to your view (orange, yellow)',
          'Wear brighter colored clothing',
          'Use colorful objects or artwork',
          'Avoid all-black or grey environments'
        ],
        priority: 'medium',
        color: 'orange'
      });

      suggestions.push({
        category: 'temperature',
        icon: Thermometer,
        title: 'Comfortable Temperature',
        description: 'Optimize your physical comfort',
        actions: [
          'Ensure room is comfortably warm (68-72°F)',
          'Use a blanket if feeling cold',
          'Fresh air circulation',
          'Remove tight or uncomfortable clothing'
        ],
        priority: 'low',
        color: 'red'
      });
    }

    // Time-based suggestions
    if (environmentData.timeOfDay === 'morning') {
      suggestions.push({
        category: 'morning',
        icon: Sun,
        title: 'Morning Energy Setup',
        description: 'Optimize your space for a positive start',
        actions: [
          'Open windows for fresh air',
          'Use bright, cool lighting',
          'Play upbeat or energizing music',
          'Position yourself facing east if possible'
        ],
        priority: 'medium',
        color: 'yellow'
      });
    }

    if (environmentData.timeOfDay === 'evening' || environmentData.timeOfDay === 'night') {
      suggestions.push({
        category: 'evening',
        icon: Moon,
        title: 'Evening Wind-Down',
        description: 'Prepare your environment for relaxation',
        actions: [
          'Dim lights to 30% or less',
          'Use warm lighting (2700K)',
          'Play calming or ambient music',
          'Remove screens from view',
          'Use lavender or chamomile scents'
        ],
        priority: 'high',
        color: 'indigo'
      });
    }

    // Weather-based suggestions
    if (environmentData.weather?.condition === 'rainy' || environmentData.weather?.condition === 'cloudy') {
      suggestions.push({
        category: 'weather',
        icon: Cloud,
        title: 'Rainy Day Comfort',
        description: 'Counter the effects of gloomy weather',
        actions: [
          'Increase indoor lighting significantly',
          'Use a warm drink as comfort',
          'Play the sound of rain as positive background',
          'Focus on cozy, warm textures'
        ],
        priority: 'medium',
        color: 'gray'
      });
    }

    setSuggestions(suggestions);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      gray: 'bg-gray-50 border-gray-200 text-gray-800'
    };
    return colors[color] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Environmental Therapy</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your environment...</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Environment Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Current Environment</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Time:</strong> {environmentData.timeOfDay}
                </div>
                <div>
                  <strong>Lighting:</strong> {environmentData.lighting}
                </div>
                {environmentData.weather && (
                  <>
                    <div>
                      <strong>Weather:</strong> {environmentData.weather.condition}
                    </div>
                    <div>
                      <strong>Location:</strong> {environmentData.weather.city}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Personalized Suggestions */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personalized for {currentMood} mood
            </h3>

            <div className="space-y-4">
              {suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                return (
                  <div key={index} className={`border rounded-lg p-4 ${getColorClasses(suggestion.color)}`}>
                    <div className="flex items-start space-x-3">
                      <IconComponent className="h-6 w-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                        <p className="text-sm mb-3">{suggestion.description}</p>
                        <ul className="text-sm space-y-1">
                          {suggestion.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-current rounded-full flex-shrink-0"></span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                        {suggestion.priority === 'high' && (
                          <div className="mt-2">
                            <span className="inline-block bg-white bg-opacity-50 text-xs font-medium px-2 py-1 rounded">
                              High Priority
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                I'll try these suggestions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
