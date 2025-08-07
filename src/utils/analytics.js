// Simple privacy-friendly analytics utility
// Only tracks basic usage patterns, no personal data

class PrivacyAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  // Track basic events without personal data
  track(event, data = {}) {
    const analyticsData = {
      event,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      sessionDuration: Date.now() - this.startTime,
      ...data
    };

    // Store locally for now (could be sent to privacy-friendly analytics later)
    const existingData = JSON.parse(localStorage.getItem('mindfulchat-analytics') || '[]');
    existingData.push(analyticsData);
    
    // Keep only last 100 events to avoid storage bloat
    if (existingData.length > 100) {
      existingData.splice(0, existingData.length - 100);
    }
    
    localStorage.setItem('mindfulchat-analytics', JSON.stringify(existingData));
    
    console.log('Analytics:', analyticsData); // For development
  }

  // Get basic usage stats
  getStats() {
    const data = JSON.parse(localStorage.getItem('mindfulchat-analytics') || '[]');
    const sessions = [...new Set(data.map(d => d.sessionId))].length;
    const totalMessages = data.filter(d => d.event === 'message_sent').length;
    const crisisInterventions = data.filter(d => d.event === 'crisis_intervention').length;
    const breathingExercises = data.filter(d => d.event === 'breathing_exercise').length;

    return {
      totalSessions: sessions,
      totalMessages,
      crisisInterventions,
      breathingExercises,
      lastActivity: data.length > 0 ? new Date(Math.max(...data.map(d => d.timestamp))) : null
    };
  }
}

export default new PrivacyAnalytics();
