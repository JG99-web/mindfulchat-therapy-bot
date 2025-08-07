import { useState, useEffect } from 'react';
import { X, BarChart3, Plus, Smile, Zap, Brain, Award, Calendar, Clock } from 'lucide-react';
import { MoodTracker, getMoodColor, getMoodEmoji } from '../utils/moodTracker';

export default function MoodDashboard({ isOpen, onClose, userName, onOpenCheckIn }) {
  const [moodTracker, setMoodTracker] = useState(null);
  const [stats, setStats] = useState({
    totalEntries: 0,
    streaks: { current: 0, longest: 0 },
    recent30Days: {
      count: 0,
      averageMood: 5,
      averageEnergy: 5,
      averageStress: 5
    }
  });
  const [recentEntries, setRecentEntries] = useState([]);

  useEffect(() => {
    if (userName && isOpen) {
      try {
        const tracker = new MoodTracker(userName || 'anonymous');
        setMoodTracker(tracker);
        const trackerStats = tracker.getStats();
        if (trackerStats) {
          setStats(trackerStats);
        }
        
        // Load recent entries
        const entries = tracker.getRecentEntries(7); // Last 7 entries
        setRecentEntries(entries || []);
      } catch (error) {
        console.error('Error loading mood tracker:', error);
      }
    }
  }, [userName, isOpen]);

  if (!isOpen) return null;

  const hasCheckedInToday = moodTracker?.hasCheckedInToday();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mood Dashboard</h2>
              <p className="text-gray-600">Your mental health insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!hasCheckedInToday && (
              <button
                onClick={onOpenCheckIn}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Check In Today</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Smile className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {stats.recent30Days.averageMood?.toFixed(1) || '5.0'}
                  </div>
                  <div className="text-sm text-blue-700">Avg Mood</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-900">
                    {stats.recent30Days.averageEnergy?.toFixed(1) || '5.0'}
                  </div>
                  <div className="text-sm text-yellow-700">Avg Energy</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-900">
                    {stats.recent30Days.averageStress?.toFixed(1) || '5.0'}
                  </div>
                  <div className="text-sm text-red-700">Avg Stress</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">
                    {stats.streaks?.current || 0}
                  </div>
                  <div className="text-sm text-green-700">Day Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Welcome to Mood Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Track Your Progress</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Daily check-ins help you understand patterns in your mood, energy, and stress levels.
                </p>
                <button
                  onClick={onOpenCheckIn}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Start Your First Check-in
                </button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Build Healthy Habits</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Regular tracking helps identify what activities and situations affect your wellbeing.
                </p>
                <div className="text-sm text-purple-700 bg-purple-100 px-3 py-2 rounded-lg">
                  💡 Tip: Try to check in at the same time each day for the most accurate insights.
                </div>
              </div>
            </div>
          </div>

          {/* Total Entries Display */}
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.totalEntries}</div>
            <div className="text-gray-600">Total Mood Entries</div>
            {stats.totalEntries === 0 && (
              <p className="text-gray-500 text-sm mt-2">Start tracking to see your insights here!</p>
            )}
          </div>

          {/* Recent Entries */}
          {recentEntries.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Recent Check-ins
              </h3>
              <div className="space-y-3">
                {recentEntries.slice(0, 5).map((entry, index) => (
                  <div key={entry.id || index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                          <div className="text-xs text-gray-500">Mood</div>
                        </div>
                        <div className="flex space-x-6">
                          <div className="text-center">
                            <div className="font-bold text-blue-600">{entry.mood}/10</div>
                            <div className="text-xs text-gray-500">Mood</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-yellow-600">{entry.energy}/10</div>
                            <div className="text-xs text-gray-500">Energy</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-red-600">{entry.stress}/10</div>
                            <div className="text-xs text-gray-500">Stress</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Emotions:</div>
                        <div className="flex flex-wrap gap-1">
                          {entry.emotions.slice(0, 3).map((emotion, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {emotion}
                            </span>
                          ))}
                          {entry.emotions.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{entry.emotions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {entry.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Notes:</div>
                        <div className="text-sm text-gray-700 italic">
                          "{entry.notes.length > 100 ? entry.notes.substring(0, 100) + '...' : entry.notes}"
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {recentEntries.length > 5 && (
                <div className="text-center mt-4">
                  <div className="text-sm text-gray-500">
                    Showing 5 of {recentEntries.length} recent entries
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
