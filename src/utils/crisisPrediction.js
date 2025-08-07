// Advanced Crisis Prediction System
// Analyzes patterns to predict potential mental health crises

export class CrisisPrediction {
  constructor(userName) {
    this.userName = userName;
    this.storageKey = `crisis-prediction-${userName}`;
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {
        riskIndicators: [],
        conversationPatterns: [],
        moodPatterns: [],
        riskScore: 0,
        lastAssessment: null,
        warnings: []
      };
    } catch (error) {
      console.error('Error loading crisis prediction data:', error);
      return {
        riskIndicators: [],
        conversationPatterns: [],
        moodPatterns: [],
        riskScore: 0,
        lastAssessment: null,
        warnings: []
      };
    }
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving crisis prediction data:', error);
    }
  }

  // Analyze message for crisis indicators
  analyzeMessage(message, isBot = false) {
    if (isBot) return; // Only analyze user messages

    const riskKeywords = {
      high: [
        'kill myself', 'end it all', 'suicide', 'want to die', 'better off dead',
        'no point living', 'end my life', 'hurt myself', 'self harm'
      ],
      medium: [
        'hopeless', 'worthless', 'give up', 'can\'t go on', 'nothing matters',
        'no future', 'trapped', 'burden', 'alone forever', 'pointless'
      ],
      low: [
        'depressed', 'sad', 'anxious', 'stressed', 'overwhelmed', 'tired',
        'struggling', 'difficult', 'hard time', 'not okay'
      ]
    };

    const positiveKeywords = [
      'better', 'improving', 'hope', 'grateful', 'thankful', 'progress',
      'healing', 'support', 'help', 'therapy', 'treatment', 'recovery'
    ];

    const timestamp = new Date().toISOString();
    let riskLevel = 0;
    let matchedKeywords = [];

    // Check for risk indicators
    const lowerMessage = message.toLowerCase();
    
    // High risk
    for (const keyword of riskKeywords.high) {
      if (lowerMessage.includes(keyword)) {
        riskLevel = Math.max(riskLevel, 3);
        matchedKeywords.push({ keyword, level: 'high' });
      }
    }

    // Medium risk
    for (const keyword of riskKeywords.medium) {
      if (lowerMessage.includes(keyword)) {
        riskLevel = Math.max(riskLevel, 2);
        matchedKeywords.push({ keyword, level: 'medium' });
      }
    }

    // Low risk
    for (const keyword of riskKeywords.low) {
      if (lowerMessage.includes(keyword)) {
        riskLevel = Math.max(riskLevel, 1);
        matchedKeywords.push({ keyword, level: 'low' });
      }
    }

    // Check for positive indicators (reduce risk)
    let positiveScore = 0;
    for (const keyword of positiveKeywords) {
      if (lowerMessage.includes(keyword)) {
        positiveScore += 0.5;
      }
    }

    // Adjust risk based on positive indicators
    riskLevel = Math.max(0, riskLevel - positiveScore);

    // Store risk indicator
    if (riskLevel > 0 || matchedKeywords.length > 0) {
      this.data.riskIndicators.push({
        timestamp,
        message,
        riskLevel,
        matchedKeywords,
        positiveScore
      });

      // Keep only last 50 indicators
      if (this.data.riskIndicators.length > 50) {
        this.data.riskIndicators.shift();
      }
    }

    // Analyze conversation patterns
    this.analyzeConversationPattern(message, riskLevel);
    
    this.saveData();
    return { riskLevel, matchedKeywords };
  }

  // Analyze conversation patterns for escalation
  analyzeConversationPattern(message, riskLevel) {
    const pattern = {
      timestamp: new Date().toISOString(),
      messageLength: message.length,
      riskLevel,
      hour: new Date().getHours(),
      wordCount: message.split(' ').length
    };

    this.data.conversationPatterns.push(pattern);

    // Keep only last 100 patterns
    if (this.data.conversationPatterns.length > 100) {
      this.data.conversationPatterns.shift();
    }
  }

  // Update mood patterns from mood tracker
  updateMoodPattern(moodData) {
    const pattern = {
      timestamp: new Date().toISOString(),
      mood: moodData.mood,
      energy: moodData.energy,
      stress: moodData.stress,
      emotions: moodData.emotions || []
    };

    this.data.moodPatterns.push(pattern);

    // Keep only last 30 mood patterns
    if (this.data.moodPatterns.length > 30) {
      this.data.moodPatterns.shift();
    }

    this.saveData();
  }

  // Calculate overall risk score
  calculateRiskScore() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Recent risk indicators (last 24 hours)
    const recentRisks = this.data.riskIndicators.filter(
      indicator => new Date(indicator.timestamp) >= last24Hours
    );

    // Risk escalation in last 7 days
    const weeklyRisks = this.data.riskIndicators.filter(
      indicator => new Date(indicator.timestamp) >= last7Days
    );

    // Recent mood decline
    const recentMoods = this.data.moodPatterns.filter(
      pattern => new Date(pattern.timestamp) >= last7Days
    );

    let riskScore = 0;

    // Weight recent high-risk indicators heavily
    recentRisks.forEach(risk => {
      if (risk.riskLevel === 3) riskScore += 10;
      else if (risk.riskLevel === 2) riskScore += 5;
      else if (risk.riskLevel === 1) riskScore += 2;
    });

    // Check for escalation pattern
    if (weeklyRisks.length > 0) {
      const avgRisk = weeklyRisks.reduce((sum, risk) => sum + risk.riskLevel, 0) / weeklyRisks.length;
      if (avgRisk > 1.5) riskScore += 5;
    }

    // Check mood decline
    if (recentMoods.length >= 3) {
      const avgMood = recentMoods.reduce((sum, mood) => sum + mood.mood, 0) / recentMoods.length;
      if (avgMood < 4) riskScore += 3;
      if (avgMood < 3) riskScore += 5;
    }

    // Check for concerning conversation patterns
    const recentConversations = this.data.conversationPatterns.filter(
      pattern => new Date(pattern.timestamp) >= last24Hours
    );

    // Late night distress patterns
    const lateNightMessages = recentConversations.filter(
      pattern => pattern.hour >= 23 || pattern.hour <= 5
    );

    if (lateNightMessages.length > 2) riskScore += 3;

    this.data.riskScore = Math.min(riskScore, 25); // Cap at 25
    this.data.lastAssessment = now.toISOString();
    
    this.saveData();
    return this.data.riskScore;
  }

  // Get risk level assessment
  getRiskAssessment() {
    const score = this.calculateRiskScore();
    
    if (score >= 15) {
      return {
        level: 'high',
        message: 'High risk detected. Immediate intervention recommended.',
        color: 'red',
        actions: ['crisis_intervention', 'emergency_contacts', 'professional_help']
      };
    } else if (score >= 8) {
      return {
        level: 'medium',
        message: 'Moderate risk. Increased monitoring and support recommended.',
        color: 'orange',
        actions: ['breathing_exercise', 'mood_check', 'coping_strategies']
      };
    } else if (score >= 3) {
      return {
        level: 'low',
        message: 'Low risk. Continue regular support and monitoring.',
        color: 'yellow',
        actions: ['mood_tracking', 'self_care', 'positive_activities']
      };
    } else {
      return {
        level: 'minimal',
        message: 'Minimal risk. Maintain healthy practices.',
        color: 'green',
        actions: ['continue_tracking', 'preventive_care']
      };
    }
  }

  // Generate prevention suggestions
  getPreventionSuggestions() {
    const assessment = this.getRiskAssessment();
    const suggestions = [];

    if (assessment.level === 'high') {
      suggestions.push(
        'Consider reaching out to a crisis helpline immediately',
        'Contact emergency services if in immediate danger',
        'Reach out to a trusted friend or family member',
        'Visit your nearest emergency department'
      );
    } else if (assessment.level === 'medium') {
      suggestions.push(
        'Schedule an appointment with a mental health professional',
        'Increase frequency of mood tracking',
        'Practice breathing exercises daily',
        'Maintain regular contact with support network'
      );
    } else if (assessment.level === 'low') {
      suggestions.push(
        'Continue daily mood tracking',
        'Maintain healthy sleep schedule',
        'Engage in regular physical activity',
        'Practice mindfulness or meditation'
      );
    }

    return suggestions;
  }

  // Get trends and patterns
  getTrends() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const monthlyRisks = this.data.riskIndicators.filter(
      indicator => new Date(indicator.timestamp) >= last30Days
    );

    const monthlyMoods = this.data.moodPatterns.filter(
      pattern => new Date(pattern.timestamp) >= last30Days
    );

    return {
      riskTrend: this.calculateTrend(monthlyRisks.map(r => r.riskLevel)),
      moodTrend: this.calculateTrend(monthlyMoods.map(m => m.mood)),
      averageRisk: monthlyRisks.length > 0 ? 
        monthlyRisks.reduce((sum, r) => sum + r.riskLevel, 0) / monthlyRisks.length : 0,
      averageMood: monthlyMoods.length > 0 ? 
        monthlyMoods.reduce((sum, m) => sum + m.mood, 0) / monthlyMoods.length : 5
    };
  }

  calculateTrend(values) {
    if (values.length < 2) return 'stable';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (Math.abs(difference) < 0.3) return 'stable';
    return difference > 0 ? 'increasing' : 'decreasing';
  }
}
