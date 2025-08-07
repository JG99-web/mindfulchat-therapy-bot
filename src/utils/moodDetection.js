// Utility to analyze conversation text and detect emotional state for environmental therapy

export const detectMoodFromConversation = (messages) => {
  if (!messages || messages.length === 0) return 'neutral';
  
  // Get recent messages (last 5 user messages)
  const recentUserMessages = messages
    .filter(msg => msg.role === 'user')
    .slice(-5)
    .map(msg => msg.content.toLowerCase());
  
  const allRecentText = recentUserMessages.join(' ');
  
  // Mood detection keywords and patterns
  const moodPatterns = {
    anxious: {
      keywords: ['anxious', 'worried', 'nervous', 'panic', 'overwhelmed', 'stressed', 'tense', 'restless', 'fear', 'afraid', 'racing thoughts', 'can\'t stop thinking', 'what if', 'disaster', 'worst case'],
      weight: 1
    },
    depressed: {
      keywords: ['depressed', 'sad', 'hopeless', 'empty', 'worthless', 'tired', 'exhausted', 'unmotivated', 'nothing matters', 'give up', 'pointless', 'dark', 'heavy', 'numb', 'alone', 'isolated'],
      weight: 1
    },
    stressed: {
      keywords: ['stressed', 'pressure', 'overwhelmed', 'too much', 'can\'t handle', 'breaking point', 'burnout', 'deadline', 'busy', 'chaos', 'frantic', 'rushing'],
      weight: 0.8
    },
    angry: {
      keywords: ['angry', 'furious', 'mad', 'rage', 'frustrated', 'irritated', 'annoyed', 'pissed', 'hate', 'unfair', 'stupid', 'ridiculous'],
      weight: 0.9
    },
    low: {
      keywords: ['low', 'down', 'blue', 'gloomy', 'drained', 'flat', 'blah', 'meh', 'gray', 'dull', 'lifeless', 'going through motions'],
      weight: 0.7
    },
    excited: {
      keywords: ['excited', 'happy', 'great', 'amazing', 'wonderful', 'fantastic', 'thrilled', 'pumped', 'energized', 'motivated'],
      weight: -0.5 // Positive mood
    },
    content: {
      keywords: ['good', 'fine', 'okay', 'alright', 'decent', 'stable', 'calm', 'peaceful', 'balanced'],
      weight: -0.3 // Slightly positive
    }
  };
  
  // Calculate mood scores
  const moodScores = {};
  
  Object.entries(moodPatterns).forEach(([mood, pattern]) => {
    let score = 0;
    pattern.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/'/g, "'")}\\b`, 'gi');
      const matches = allRecentText.match(regex);
      if (matches) {
        score += matches.length * pattern.weight;
      }
    });
    moodScores[mood] = score;
  });
  
  // Find dominant mood
  const sortedMoods = Object.entries(moodScores)
    .filter(([mood, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);
  
  if (sortedMoods.length === 0) return 'neutral';
  
  const [dominantMood, score] = sortedMoods[0];
  
  // Return mood only if score is significant enough
  return score >= 0.5 ? dominantMood : 'neutral';
};

export const getMoodColor = (mood) => {
  const colors = {
    anxious: 'blue',
    depressed: 'gray',
    stressed: 'red',
    angry: 'orange',
    low: 'indigo',
    excited: 'green',
    content: 'emerald',
    neutral: 'slate'
  };
  return colors[mood] || 'slate';
};

export const getMoodEmoji = (mood) => {
  const emojis = {
    anxious: '😰',
    depressed: '😔',
    stressed: '😵',
    angry: '😤',
    low: '😞',
    excited: '😄',
    content: '😌',
    neutral: '🙂'
  };
  return emojis[mood] || '🙂';
};

export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};
