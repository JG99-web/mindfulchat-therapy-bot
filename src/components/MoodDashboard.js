import { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Activity, Brain, Heart, Award, Target, BarChart3, PieChart, Smile, Zap, AlertTriangle } from 'lucide-react';
import { MoodTracker, getMoodColor, getMoodEmoji, getMoodLabel } from '../utils/moodTracker';

export default function MoodDashboard({ isOpen, onClose, userName, onOpenCheckIn }) {
  const [moodTracker, setMoodTracker] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    console.log('MoodDashboard useEffect called');
    console.log('userName:', userName);
    console.log('isOpen:', isOpen);
    if (isOpen) {
      const tracker = new MoodTracker(userName || 'anonymous');
      setMoodTracker(tracker);
      loadData(tracker);
    }
  }, [userName, isOpen, timeRange]);

  const loadData = (tracker) => {
    try {
      const statistics = tracker.getStats();
      console.log('MoodDashboard loaded stats:', statistics);
      setStats(statistics);
      setRecentEntries(tracker.getRecentEntries(parseInt(timeRange)));
    } catch (error) {
      console.error('Error loading mood data:', error);
      // Set default stats if there's an error
      setStats({
        totalEntries: 0,
        averageMood: 0,
        streakData: { current: 0, longest: 0 },
        moodTrend: 'stable',
        commonEmotions: [],
        helpfulActivities: [],
        commonTriggers: []
      });
      setRecentEntries([]);
    }
  };

  const refreshData = () => {
    if (moodTracker) {
      loadData(moodTracker);
    }
  };

  if (!isOpen) {
    console.log('MoodDashboard not rendering - isOpen:', isOpen);
    return null;
  }

  const hasCheckedInToday = moodTracker?.hasCheckedInToday();
  const todaysEntry = moodTracker?.getTodaysEntry();

  // Use default stats if not loaded yet
  const defaultStats = {
    totalEntries: 0,
    streaks: { current: 0, longest: 0 },
    recent30Days: {
      count: 0,
      averageMood: 5,
      averageEnergy: 5,
      averageStress: 5
    },
    last7Days: {
      count: 0,
      averageMood: 5,
      averageEnergy: 5,
      averageStress: 5
    },
    insights: { commonTriggers: [], helpfulActivities: [], patterns: {} },
    patterns: {}
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mood Tracking Dashboard</h2>
              <p className="text-gray-600">Your mental health insights and patterns</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!hasCheckedInToday && (
              <button
                onClick={onOpenCheckIn}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check In Today
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

        {/* Today's Status */}
        {hasCheckedInToday && todaysEntry && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Check-in</h3>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Smile className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600">Mood:</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getMoodColor(todaysEntry.mood)}`}>
                      {getMoodEmoji(todaysEntry.mood)} {todaysEntry.mood}/10
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-gray-600">Energy:</span>
                    <span className="font-medium">{todaysEntry.energy}/10</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-gray-600">Stress:</span>
                    <span className="font-medium">{todaysEntry.stress}/10</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onOpenCheckIn}
                className="px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
              >
                Update Today
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'insights', label: 'Insights', icon: Brain },
              { id: 'entries', label: 'Entries', icon: Calendar }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Time Range Selector */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'trends' && 'Mood Trends'}
              {activeTab === 'insights' && 'Personal Insights'}
              {activeTab === 'entries' && 'Mood Entries'}
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 2 weeks</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Avg Mood</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {stats.recent30Days.averageMood?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-blue-700 text-xs">Last {timeRange} days</p>
                    </div>
                    <Smile className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Avg Energy</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {stats.recent30Days.averageEnergy?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-yellow-700 text-xs">Last {timeRange} days</p>
                    </div>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Avg Stress</p>
                      <p className="text-2xl font-bold text-red-900">
                        {stats.recent30Days.averageStress?.toFixed(1) || 'N/A'}
                      </p>
                      <p className="text-red-700 text-xs">Last {timeRange} days</p>
                    </div>
                    <Brain className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Check-in Streak</p>
                      <p className="text-2xl font-bold text-green-900">
                        {stats.streaks.current}
                      </p>
                      <p className="text-green-700 text-xs">
                        Best: {stats.streaks.longest} days
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Quick Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood Trend</h4>
                  <div className="space-y-3">
                    {recentEntries.slice(0, 7).map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(entry.mood / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{entry.mood}</span>
                          <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Activities</h4>
                  <div className="space-y-3">
                    {stats.insights.helpfulActivities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{activity.activity}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(activity.averageMood / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{activity.averageMood.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <div className="space-y-4">
              {recentEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
                  <p className="text-gray-600 mb-4">Start tracking your mood to see insights here</p>
                  <button
                    onClick={onOpenCheckIn}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Make Your First Entry
                  </button>
                </div>
              ) : (
                recentEntries.map((entry) => (
                  <div key={entry.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {new Date(entry.timestamp).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(entry.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Mood</div>
                          <div className={`text-lg font-bold ${getMoodColor(entry.mood).split(' ')[0]}`}>
                            {entry.mood}/10
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Energy & Stress</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Energy:</span>
                            <span className="font-medium">{entry.energy}/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Stress:</span>
                            <span className="font-medium">{entry.stress}/10</span>
                          </div>
                          {entry.sleep && (
                            <div className="flex justify-between text-sm">
                              <span>Sleep:</span>
                              <span className="font-medium">{entry.sleep}h</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {entry.emotions.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Emotions</h5>
                          <div className="flex flex-wrap gap-1">
                            {entry.emotions.slice(0, 4).map((emotion, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {emotion}
                              </span>
                            ))}
                            {entry.emotions.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{entry.emotions.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {entry.activities.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Activities</h5>
                          <div className="flex flex-wrap gap-1">
                            {entry.activities.slice(0, 3).map((activity, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                              >
                                {activity}
                              </span>
                            ))}
                            {entry.activities.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{entry.activities.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {entry.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                        <p className="text-sm text-gray-600">{entry.notes}</p>
                      </div>
                    )}
                    
                    {entry.gratitude && entry.gratitude.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Gratitude</h5>
                        <ul className="space-y-1">
                          {entry.gratitude.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {stats.insights.commonTriggers.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Common Triggers
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.insights.commonTriggers.map((trigger, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm text-gray-700">{trigger.trigger}</span>
                        <span className="text-sm font-medium text-red-600">{trigger.count} times</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.insights.helpfulActivities.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 text-green-600 mr-2" />
                    Helpful Activities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.insights.helpfulActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm text-gray-700">{activity.activity}</span>
                        <span className="text-sm font-medium text-green-600">
                          Avg mood: {activity.averageMood.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Patterns & Recommendations</h4>
                <div className="space-y-4">
                  {stats.patterns.averageMood < 5 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-2">Low Mood Pattern Detected</h5>
                      <p className="text-sm text-yellow-700">
                        Your average mood has been below 5/10. Consider reaching out to a mental health professional
                        or using more of your helpful activities like {stats.insights.helpfulActivities[0]?.activity}.
                      </p>
                    </div>
                  )}
                  
                  {stats.streaks.current >= 7 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Great Consistency! 🎉</h5>
                      <p className="text-sm text-green-700">
                        You've been consistent with mood tracking for {stats.streaks.current} days.
                        This self-awareness is a key part of mental wellness!
                      </p>
                    </div>
                  )}
                  
                  {stats.patterns.averageStress > 7 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-2">High Stress Levels</h5>
                      <p className="text-sm text-red-700">
                        Your stress levels have been consistently high. Consider stress management techniques
                        like breathing exercises, meditation, or speaking with a counselor.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
