// Advanced memory management for long-term therapeutic relationships

export class AdaptiveMemory {
  constructor(userName) {
    this.userName = userName;
    this.storageKey = `mindfulchat-memory-${userName}`;
    this.memory = this.loadMemory();
  }

  loadMemory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading memory:', error);
    }
    
    return {
      userProfile: {
        name: this.userName,
        firstVisit: new Date().toISOString(),
        totalSessions: 0,
        preferredPersona: 'cass'
      },
      lifeEvents: [], // Important events user has shared
      goals: [], // Mental health goals and progress
      relationships: [], // Important people in user's life
      triggers: [], // Things that cause stress/anxiety
      copingStrategies: [], // What works for this user
      conversationInsights: [], // Patterns and insights
      milestones: [], // Progress celebrations
      lastUpdated: new Date().toISOString()
    };
  }

  saveMemory() {
    try {
      this.memory.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }

  // Track important life events
  addLifeEvent(event, importance = 'medium') {
    const lifeEvent = {
      id: Date.now(),
      event: event,
      importance: importance, // low, medium, high, critical
      dateShared: new Date().toISOString(),
      followUpNeeded: importance === 'high' || importance === 'critical'
    };
    
    this.memory.lifeEvents.push(lifeEvent);
    this.saveMemory();
  }

  // Track goals and progress
  addGoal(goal, category = 'general') {
    const goalObj = {
      id: Date.now(),
      goal: goal,
      category: category, // mental-health, lifestyle, relationships, etc.
      dateSet: new Date().toISOString(),
      status: 'active',
      progress: [],
      lastCheckedIn: null
    };
    
    this.memory.goals.push(goalObj);
    this.saveMemory();
  }

  updateGoalProgress(goalId, progressNote, status = 'active') {
    const goal = this.memory.goals.find(g => g.id === goalId);
    if (goal) {
      goal.progress.push({
        date: new Date().toISOString(),
        note: progressNote
      });
      goal.status = status;
      goal.lastCheckedIn = new Date().toISOString();
      this.saveMemory();
    }
  }

  // Track important relationships
  addRelationship(person, relationship, context = '') {
    const relationshipObj = {
      id: Date.now(),
      person: person,
      relationship: relationship, // family, friend, partner, coworker, etc.
      context: context,
      dateShared: new Date().toISOString(),
      lastMentioned: new Date().toISOString()
    };
    
    this.memory.relationships.push(relationshipObj);
    this.saveMemory();
  }

  // Track triggers and stressors
  addTrigger(trigger, severity = 'medium', context = '') {
    const triggerObj = {
      id: Date.now(),
      trigger: trigger,
      severity: severity, // low, medium, high
      context: context,
      dateIdentified: new Date().toISOString(),
      occurrences: 1
    };
    
    this.memory.triggers.push(triggerObj);
    this.saveMemory();
  }

  // Track effective coping strategies
  addCopingStrategy(strategy, effectiveness = 'medium', context = '') {
    const strategyObj = {
      id: Date.now(),
      strategy: strategy,
      effectiveness: effectiveness, // low, medium, high
      context: context,
      dateIdentified: new Date().toISOString(),
      timesUsed: 1
    };
    
    this.memory.copingStrategies.push(strategyObj);
    this.saveMemory();
  }

  // Add conversation insights
  addInsight(insight, category = 'general') {
    const insightObj = {
      id: Date.now(),
      insight: insight,
      category: category, // pattern, breakthrough, concern, progress
      date: new Date().toISOString()
    };
    
    this.memory.conversationInsights.push(insightObj);
    this.saveMemory();
  }

  // Add milestone achievements
  addMilestone(milestone, type = 'progress') {
    const milestoneObj = {
      id: Date.now(),
      milestone: milestone,
      type: type, // progress, breakthrough, goal-achieved, time-based
      date: new Date().toISOString(),
      celebrated: false
    };
    
    this.memory.milestones.push(milestoneObj);
    this.saveMemory();
  }

  // Get context for AI conversations
  getConversationContext() {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Recent important events
    const recentEvents = this.memory.lifeEvents
      .filter(event => new Date(event.dateShared) > oneWeekAgo)
      .sort((a, b) => new Date(b.dateShared) - new Date(a.dateShared));

    // Active goals
    const activeGoals = this.memory.goals
      .filter(goal => goal.status === 'active')
      .slice(0, 3); // Most recent 3

    // Recent relationships mentioned
    const recentRelationships = this.memory.relationships
      .filter(rel => new Date(rel.lastMentioned) > oneMonthAgo)
      .slice(0, 5);

    // Most frequent triggers
    const frequentTriggers = this.memory.triggers
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 3);

    // Most effective coping strategies
    const effectiveCoping = this.memory.copingStrategies
      .filter(strategy => strategy.effectiveness === 'high')
      .slice(0, 3);

    // Uncelebrated milestones
    const uncelebratedMilestones = this.memory.milestones
      .filter(milestone => !milestone.celebrated)
      .slice(0, 2);

    return {
      userProfile: this.memory.userProfile,
      recentEvents,
      activeGoals,
      recentRelationships,
      frequentTriggers,
      effectiveCoping,
      uncelebratedMilestones,
      totalSessions: this.memory.userProfile.totalSessions,
      daysSinceFirstVisit: Math.floor((now - new Date(this.memory.userProfile.firstVisit)) / (1000 * 60 * 60 * 24))
    };
  }

  // Increment session count
  incrementSessionCount() {
    this.memory.userProfile.totalSessions += 1;
    this.saveMemory();
  }

  // Get memory summary for AI
  getMemorySummary() {
    const context = this.getConversationContext();
    
    let summary = `User Profile: ${context.userProfile.name} has been using MindfulChat for ${context.daysSinceFirstVisit} days with ${context.totalSessions} total sessions.`;
    
    if (context.recentEvents.length > 0) {
      summary += `\n\nRecent Life Events: ${context.recentEvents.map(e => e.event).join('; ')}`;
    }
    
    if (context.activeGoals.length > 0) {
      summary += `\n\nActive Goals: ${context.activeGoals.map(g => g.goal).join('; ')}`;
    }
    
    if (context.recentRelationships.length > 0) {
      summary += `\n\nImportant People: ${context.recentRelationships.map(r => `${r.person} (${r.relationship})`).join('; ')}`;
    }
    
    if (context.frequentTriggers.length > 0) {
      summary += `\n\nKnown Triggers: ${context.frequentTriggers.map(t => t.trigger).join('; ')}`;
    }
    
    if (context.effectiveCoping.length > 0) {
      summary += `\n\nEffective Coping Strategies: ${context.effectiveCoping.map(c => c.strategy).join('; ')}`;
    }
    
    if (context.uncelebratedMilestones.length > 0) {
      summary += `\n\nRecent Achievements to Celebrate: ${context.uncelebratedMilestones.map(m => m.milestone).join('; ')}`;
    }
    
    return summary;
  }

  // Clear all memory (for privacy)
  clearMemory() {
    localStorage.removeItem(this.storageKey);
    this.memory = this.loadMemory();
  }
}

// Helper functions for memory extraction from conversations
export const extractMemoryFromMessage = (message, userName) => {
  // Ensure message is a string
  if (!message || typeof message !== 'string') {
    console.warn('extractMemoryFromMessage called with invalid message:', message);
    return;
  }
  
  const lowerMessage = message.toLowerCase();
  const memory = new AdaptiveMemory(userName);
  
  // Goal detection patterns
  const goalPatterns = [
    /i want to (.+)/,
    /my goal is to (.+)/,
    /i'm trying to (.+)/,
    /i hope to (.+)/,
    /i'd like to (.+)/
  ];
  
  // Relationship detection patterns
  const relationshipPatterns = [
    /my (mother|mom|father|dad|sister|brother|husband|wife|boyfriend|girlfriend|partner|friend|coworker|boss) (.+)/,
    /(my|our) (child|son|daughter|kids|family) (.+)/
  ];
  
  // Trigger detection patterns
  const triggerPatterns = [
    /(.+) makes me (anxious|stressed|depressed|angry|upset)/,
    /i get (anxious|stressed|worried) when (.+)/,
    /(.+) always triggers me/
  ];
  
  // Coping strategy patterns
  const copingPatterns = [
    /(.+) helps me feel better/,
    /when i (.+) i feel calmer/,
    /(.+) really works for me/
  ];
  
  // Extract goals
  goalPatterns.forEach(pattern => {
    const match = lowerMessage.match(pattern);
    if (match) {
      memory.addGoal(match[1].trim(), 'mental-health');
    }
  });
  
  // Extract relationships
  relationshipPatterns.forEach(pattern => {
    const match = lowerMessage.match(pattern);
    if (match) {
      memory.addRelationship(match[1] || 'family member', match[2] || 'family', match[3] || '');
    }
  });
  
  // Extract triggers
  triggerPatterns.forEach(pattern => {
    const match = lowerMessage.match(pattern);
    if (match) {
      memory.addTrigger(match[1]?.trim() || match[2]?.trim(), 'medium');
    }
  });
  
  // Extract coping strategies
  copingPatterns.forEach(pattern => {
    const match = lowerMessage.match(pattern);
    if (match) {
      memory.addCopingStrategy(match[1].trim(), 'high');
    }
  });
  
  return memory;
};
