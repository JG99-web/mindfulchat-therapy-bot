import { useState, useEffect } from 'react';
import { X, Heart, Activity, Zap, Brain, Moon, Smile, Plus, Trash2, Calendar } from 'lucide-react';
import { MoodTracker, EMOTION_OPTIONS, ACTIVITY_OPTIONS, TRIGGER_OPTIONS, getMoodColor, getMoodEmoji, getMoodLabel } from '../utils/moodTracker';

export default function MoodCheckIn({ isOpen, onClose, userName, onMoodLogged }) {
  const [moodTracker, setMoodTracker] = useState(null);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mood: 5,
    emotions: [],
    energy: 5,
    stress: 5,
    sleep: '',
    activities: [],
    triggers: [],
    notes: '',
    gratitude: ['', '', ''],
    symptoms: [],
    medications: [],
    therapy: false,
    weather: null
  });

  useEffect(() => {
    if (userName && isOpen) {
      const tracker = new MoodTracker(userName);
      setMoodTracker(tracker);
      
      // Check if user has already checked in today
      const todaysEntry = tracker.getTodaysEntry();
      if (todaysEntry) {
        setCurrentEntry(todaysEntry);
        setFormData({
          mood: todaysEntry.mood,
          emotions: todaysEntry.emotions || [],
          energy: todaysEntry.energy || 5,
          stress: todaysEntry.stress || 5,
          sleep: todaysEntry.sleep || '',
          activities: todaysEntry.activities || [],
          triggers: todaysEntry.triggers || [],
          notes: todaysEntry.notes || '',
          gratitude: todaysEntry.gratitude || ['', '', ''],
          symptoms: todaysEntry.symptoms || [],
          medications: todaysEntry.medications || [],
          therapy: todaysEntry.therapy || false,
          weather: todaysEntry.weather || null
        });
      }
    }
  }, [userName, isOpen]);

  const handleSubmit = () => {
    if (!moodTracker) return;

    const entryData = {
      ...formData,
      gratitude: formData.gratitude.filter(item => item.trim() !== '')
    };

    if (currentEntry) {
      // Update existing entry
      moodTracker.updateTodaysEntry(entryData);
    } else {
      // Create new entry
      moodTracker.addMoodEntry(entryData);
    }

    if (onMoodLogged) {
      onMoodLogged(entryData);
    }

    onClose();
  };

  const addToArray = (field, value) => {
    if (!formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
    }
  };

  const removeFromArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const updateGratitude = (index, value) => {
    const newGratitude = [...formData.gratitude];
    newGratitude[index] = value;
    setFormData(prev => ({ ...prev, gratitude: newGratitude }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentEntry ? 'Update Today\'s Check-in' : 'Daily Mood Check-in'}
              </h2>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Step 1: Mood & Core Metrics */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How are you feeling today?</h3>
                <p className="text-gray-600">Rate your overall mood, energy, and stress levels</p>
              </div>

              {/* Mood Scale */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Smile className="h-4 w-4 mr-2" />
                    Overall Mood
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(formData.mood)}`}>
                      {getMoodEmoji(formData.mood)} {getMoodLabel(formData.mood)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{formData.mood}/10</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.mood}
                  onChange={(e) => setFormData(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>😢 Very Low</span>
                  <span>😐 Neutral</span>
                  <span>😄 Excellent</span>
                </div>
              </div>

              {/* Energy Level */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Energy Level
                  </label>
                  <span className="text-lg font-bold text-gray-900">{formData.energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.energy}
                  onChange={(e) => setFormData(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Exhausted</span>
                  <span>Moderate</span>
                  <span>Very Energetic</span>
                </div>
              </div>

              {/* Stress Level */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Stress Level
                  </label>
                  <span className="text-lg font-bold text-gray-900">{formData.stress}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stress}
                  onChange={(e) => setFormData(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Very Relaxed</span>
                  <span>Moderate</span>
                  <span>Very Stressed</span>
                </div>
              </div>

              {/* Sleep */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Moon className="h-4 w-4 mr-2" />
                  Hours of Sleep Last Night
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={formData.sleep}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleep: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 7.5"
                />
              </div>
            </div>
          )}

          {/* Step 2: Emotions & Activities */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tell us more about your day</h3>
                <p className="text-gray-600">What emotions did you experience and what activities did you do?</p>
              </div>

              {/* Emotions */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Emotions Experienced</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {EMOTION_OPTIONS.map(emotion => (
                    <button
                      key={emotion}
                      onClick={() => {
                        if (formData.emotions.includes(emotion)) {
                          removeFromArray('emotions', emotion);
                        } else {
                          addToArray('emotions', emotion);
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        formData.emotions.includes(emotion)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {emotion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Activities Today</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {ACTIVITY_OPTIONS.map(activity => (
                    <button
                      key={activity}
                      onClick={() => {
                        if (formData.activities.includes(activity)) {
                          removeFromArray('activities', activity);
                        } else {
                          addToArray('activities', activity);
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        formData.activities.includes(activity)
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Triggers or Stressors</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TRIGGER_OPTIONS.map(trigger => (
                    <button
                      key={trigger}
                      onClick={() => {
                        if (formData.triggers.includes(trigger)) {
                          removeFromArray('triggers', trigger);
                        } else {
                          addToArray('triggers', trigger);
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                        formData.triggers.includes(trigger)
                          ? 'bg-red-100 border-red-300 text-red-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Gratitude & Notes */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reflection & Gratitude</h3>
                <p className="text-gray-600">Take a moment to reflect on your day and note what you're grateful for</p>
              </div>

              {/* Gratitude */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Three Things I'm Grateful For</label>
                {formData.gratitude.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateGratitude(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Gratitude ${index + 1}...`}
                  />
                ))}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Anything else you'd like to note about your day, thoughts, or feelings..."
                />
              </div>

              {/* Therapy Session */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="therapy"
                  checked={formData.therapy}
                  onChange={(e) => setFormData(prev => ({ ...prev, therapy: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="therapy" className="text-sm font-medium text-gray-700">
                  I had a therapy session today
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div className="flex space-x-2">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Step indicators */}
              <div className="flex space-x-1">
                {[1, 2, 3].map(num => (
                  <div
                    key={num}
                    className={`w-3 h-3 rounded-full ${
                      num === step ? 'bg-blue-600' : num < step ? 'bg-blue-300' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentEntry ? 'Update Check-in' : 'Complete Check-in'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
