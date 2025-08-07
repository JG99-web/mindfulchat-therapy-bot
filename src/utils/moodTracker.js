// Mood Tracking System for Mental Health Bot
// Integrates with existing adaptive memory system

export class MoodTracker {
  constructor(userName) {
    this.userName = userName;
    this.storageKey = `mood-tracker-${userName}`;
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {
        entries: [],
        streaks: {
          current: 0,
          longest: 0,
          lastEntry: null
        },
        insights: {
          commonTriggers: [],
          helpfulActivities: [],
          patterns: {}
        }
      };
    } catch (error) {
      console.error('Error loading mood data:', error);
      return { entries: [], streaks: { current: 0, longest: 0, lastEntry: null }, insights: { commonTriggers: [], helpfulActivities: [], patterns: {} } };
    }
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving mood data:', error);
    }
  }

  // Add a new mood entry
  addMoodEntry(entry) {
    const moodEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toDateString(),
      mood: entry.mood, // 1-10 scale
      emotions: entry.emotions || [], // array of emotion tags
      energy: entry.energy || 5, // 1-10 scale
      stress: entry.stress || 5, // 1-10 scale
      sleep: entry.sleep || null, // hours of sleep
      activities: entry.activities || [], // activities done today
      triggers: entry.triggers || [], // what triggered negative feelings
      notes: entry.notes || '', // free text notes
      gratitude: entry.gratitude || [], // gratitude items
      symptoms: entry.symptoms || [], // mental health symptoms
      medications: entry.medications || [], // medications taken
      therapy: entry.therapy || false, // had therapy session
      weather: entry.weather || null, // weather impact
      location: entry.location || null // location (home, work, etc.)
    };

    this.data.entries.unshift(moodEntry);
    this.updateStreaks();
    this.updateInsights();
    this.saveData();
    
    return moodEntry;
  }

  // Update mood entry streaks
  updateStreaks() {
    const today = new Date().toDateString();
    const lastEntry = this.data.streaks.lastEntry;
    
    if (lastEntry) {
      const lastDate = new Date(lastEntry);
      const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        this.data.streaks.current += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        this.data.streaks.current = 1;
      }
      // Same day = no change to streak
    } else {
      // First entry
      this.data.streaks.current = 1;
    }
    
    // Update longest streak
    if (this.data.streaks.current > this.data.streaks.longest) {
      this.data.streaks.longest = this.data.streaks.current;
    }
    
    this.data.streaks.lastEntry = today;
  }

  // Analyze patterns and update insights
  updateInsights() {
    const entries = this.data.entries;
    if (entries.length < 3) return; // Need at least 3 entries for patterns
    
    // Analyze mood patterns
    const moodByDay = {};
    const moodByHour = {};
    const triggerFrequency = {};
    const activityImpact = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      
      // Mood by day of week
      if (!moodByDay[dayOfWeek]) moodByDay[dayOfWeek] = [];
      moodByDay[dayOfWeek].push(entry.mood);
      
      // Mood by hour
      if (!moodByHour[hour]) moodByHour[hour] = [];
      moodByHour[hour].push(entry.mood);
      
      // Trigger frequency
      entry.triggers.forEach(trigger => {
        triggerFrequency[trigger] = (triggerFrequency[trigger] || 0) + 1;
      });
      
      // Activity impact on mood
      entry.activities.forEach(activity => {
        if (!activityImpact[activity]) activityImpact[activity] = [];
        activityImpact[activity].push(entry.mood);
      });
    });
    
    // Calculate averages and patterns
    this.data.insights.patterns = {
      moodByDay: Object.keys(moodByDay).reduce((acc, day) => {
        acc[day] = moodByDay[day].reduce((a, b) => a + b, 0) / moodByDay[day].length;
        return acc;
      }, {}),
      moodByHour: Object.keys(moodByHour).reduce((acc, hour) => {
        acc[hour] = moodByHour[hour].reduce((a, b) => a + b, 0) / moodByHour[hour].length;
        return acc;
      }, {}),
      averageMood: entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length,
      averageEnergy: entries.reduce((sum, entry) => sum + entry.energy, 0) / entries.length,
      averageStress: entries.reduce((sum, entry) => sum + entry.stress, 0) / entries.length
    };
    
    // Update common triggers (top 5)
    this.data.insights.commonTriggers = Object.entries(triggerFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));
    
    // Update helpful activities (activities with above-average mood)
    const avgMood = this.data.insights.patterns.averageMood;
    this.data.insights.helpfulActivities = Object.entries(activityImpact)
      .map(([activity, moods]) => ({
        activity,
        averageMood: moods.reduce((a, b) => a + b, 0) / moods.length,
        count: moods.length
      }))
      .filter(item => item.averageMood > avgMood && item.count >= 2)
      .sort((a, b) => b.averageMood - a.averageMood)
      .slice(0, 8);
  }

  // Get mood entries for a specific date range
  getEntriesInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.data.entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= start && entryDate <= end;
    });
  }

  // Get mood entries for the last N days
  getRecentEntries(days = 30) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return this.data.entries.filter(entry => 
      new Date(entry.timestamp) >= cutoff
    );
  }

  // Get mood statistics
  getStats() {
    const entries = this.data.entries;
    
    // Return default stats if no entries
    if (entries.length === 0) {
      return {
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
    }
    
    const recentEntries = this.getRecentEntries(30);
    const last7Days = this.getRecentEntries(7);
    
    return {
      totalEntries: entries.length,
      streaks: this.data.streaks,
      recent30Days: {
        count: recentEntries.length,
        averageMood: recentEntries.length > 0 ? recentEntries.reduce((sum, e) => sum + e.mood, 0) / recentEntries.length : 5,
        averageEnergy: recentEntries.length > 0 ? recentEntries.reduce((sum, e) => sum + e.energy, 0) / recentEntries.length : 5,
        averageStress: recentEntries.length > 0 ? recentEntries.reduce((sum, e) => sum + e.stress, 0) / recentEntries.length : 5
      },
      last7Days: {
        count: last7Days.length,
        averageMood: last7Days.length > 0 ? last7Days.reduce((sum, e) => sum + e.mood, 0) / last7Days.length : 5,
        averageEnergy: last7Days.length > 0 ? last7Days.reduce((sum, e) => sum + e.energy, 0) / last7Days.length : 5,
        averageStress: last7Days.length > 0 ? last7Days.reduce((sum, e) => sum + e.stress, 0) / last7Days.length : 5
      },
      insights: this.data.insights,
      patterns: this.data.insights.patterns
    };
  }

  // Check if user has checked in today
  hasCheckedInToday() {
    const today = new Date().toDateString();
    return this.data.entries.some(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  }

  // Get today's entry if it exists
  getTodaysEntry() {
    const today = new Date().toDateString();
    return this.data.entries.find(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  }

  // Update today's entry
  updateTodaysEntry(updates) {
    const today = new Date().toDateString();
    const entryIndex = this.data.entries.findIndex(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
    
    if (entryIndex !== -1) {
      this.data.entries[entryIndex] = {
        ...this.data.entries[entryIndex],
        ...updates,
        timestamp: new Date().toISOString() // Update timestamp
      };
      this.updateInsights();
      this.saveData();
      return this.data.entries[entryIndex];
    }
    
    return null;
  }

  // Delete an entry
  deleteEntry(entryId) {
    const index = this.data.entries.findIndex(entry => entry.id === entryId);
    if (index !== -1) {
      this.data.entries.splice(index, 1);
      this.updateInsights();
      this.saveData();
      return true;
    }
    return false;
  }

  // Export data for backup or sharing with therapists
  exportData(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.data, null, 2);
    } else if (format === 'csv') {
      // Convert to CSV format for spreadsheet analysis
      const headers = ['Date', 'Time', 'Mood', 'Energy', 'Stress', 'Sleep', 'Notes', 'Activities', 'Triggers', 'Emotions'];
      const rows = this.data.entries.map(entry => [
        new Date(entry.timestamp).toLocaleDateString(),
        new Date(entry.timestamp).toLocaleTimeString(),
        entry.mood,
        entry.energy,
        entry.stress,
        entry.sleep || '',
        entry.notes || '',
        entry.activities.join('; '),
        entry.triggers.join('; '),
        entry.emotions.join('; ')
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }
}

// Predefined emotion and activity options
export const EMOTION_OPTIONS = [
  'Happy', 'Sad', 'Anxious', 'Excited', 'Angry', 'Calm', 'Frustrated', 'Content',
  'Overwhelmed', 'Peaceful', 'Worried', 'Grateful', 'Lonely', 'Confident', 'Tired',
  'Energetic', 'Hopeful', 'Disappointed', 'Relaxed', 'Stressed'
];

export const ACTIVITY_OPTIONS = [
  'Exercise', 'Meditation', 'Reading', 'Socializing', 'Work', 'Cooking', 'Walking',
  'Music', 'TV/Movies', 'Gaming', 'Cleaning', 'Shopping', 'Therapy', 'Journaling',
  'Art/Crafts', 'Nature', 'Prayer/Spiritual', 'Learning', 'Volunteering', 'Rest'
];

export const TRIGGER_OPTIONS = [
  'Work stress', 'Relationship conflict', 'Financial worry', 'Health concerns', 
  'Family issues', 'Social situations', 'Weather', 'Sleep problems', 'News/Media',
  'Comparison to others', 'Perfectionism', 'Loneliness', 'Change/Uncertainty',
  'Past memories', 'Future worries', 'Physical pain', 'Medication', 'Hormones'
];

// Mood visualization helpers
export const getMoodColor = (mood) => {
  if (mood >= 8) return 'text-green-600 bg-green-100';
  if (mood >= 6) return 'text-blue-600 bg-blue-100';
  if (mood >= 4) return 'text-yellow-600 bg-yellow-100';
  if (mood >= 2) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

export const getMoodEmoji = (mood) => {
  if (mood >= 9) return '😄';
  if (mood >= 7) return '😊';
  if (mood >= 6) return '🙂';
  if (mood >= 4) return '😐';
  if (mood >= 2) return '😔';
  return '😢';
};

export const getMoodLabel = (mood) => {
  if (mood >= 9) return 'Excellent';
  if (mood >= 7) return 'Good';
  if (mood >= 6) return 'Okay';
  if (mood >= 4) return 'Fair';
  if (mood >= 2) return 'Poor';
  return 'Very Low';
};
