import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { getPersonaSystemPrompt } from '../../../utils/personas';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { messages, userMessage, selectedPersona = 'cass', userName = '', memoryContext = '' } = await request.json();
    
    // Basic input validation
    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Enhanced crisis detection with severity levels
    const crisisKeywords = {
      immediate: [
        'suicide plan', 'kill myself tonight', 'kill myself today', 'end it all tonight',
        'going to kill myself', 'planning to die', 'ready to die', 'tonight is the night',
        'have the pills', 'have a gun', 'rope ready', 'bridge tonight',
        'goodbye world', 'this is goodbye', 'won\'t see tomorrow'
      ],
      severe: [
        'suicide', 'kill myself', 'end it all', 'want to die', 'better off dead',
        'suicide method', 'how to die', 'ways to die', 'end my life',
        'can\'t take it anymore', 'no reason to live', 'everyone would be better off',
        'tired of living', 'want it to stop', 'make the pain stop'
      ],
      moderate: [
        'hurt myself', 'self harm', 'cutting', 'overdose', 'self-harm',
        'worthless', 'hopeless', 'pointless', 'give up', 'can\'t go on',
        'no point living', 'hate myself', 'wish I was dead', 'disappear forever'
      ],
      mild: [
        'depressed', 'anxious', 'sad', 'overwhelmed', 'stressed',
        'can\'t cope', 'struggling', 'hard time', 'feeling down',
        'not okay', 'having a bad day', 'feeling lost'
      ]
    };

    // Determine crisis severity
    let crisisLevel = 'none';
    let matchedKeywords = [];
    
    const userMessageLower = userMessage.toLowerCase();
    
    // Check for immediate danger (highest priority)
    for (const keyword of crisisKeywords.immediate) {
      if (userMessageLower.includes(keyword)) {
        crisisLevel = 'immediate';
        matchedKeywords.push(keyword);
      }
    }
    
    // Check for severe crisis
    if (crisisLevel === 'none') {
      for (const keyword of crisisKeywords.severe) {
        if (userMessageLower.includes(keyword)) {
          crisisLevel = 'severe';
          matchedKeywords.push(keyword);
        }
      }
    }
    
    // Check for moderate crisis
    if (crisisLevel === 'none') {
      for (const keyword of crisisKeywords.moderate) {
        if (userMessageLower.includes(keyword)) {
          crisisLevel = 'moderate';
          matchedKeywords.push(keyword);
        }
      }
    }
    
    // Check for mild distress
    if (crisisLevel === 'none') {
      for (const keyword of crisisKeywords.mild) {
        if (userMessageLower.includes(keyword)) {
          crisisLevel = 'mild';
          matchedKeywords.push(keyword);
        }
      }
    }

    const hasCrisisIndicators = crisisLevel !== 'none' && crisisLevel !== 'mild';

    // Get persona-specific system prompt with crisis awareness
    let systemPrompt = getPersonaSystemPrompt(selectedPersona, true, messages, userName);
    
    // Add memory context if available
    if (memoryContext && memoryContext.trim()) {
      systemPrompt += `\n\nREMEMBERED CONTEXT: Based on our previous conversations, here's what I know about ${userName}:\n${memoryContext}\n\nPlease reference this information naturally in your response to show that you remember and care about their ongoing journey.`;
    }
    
    if (crisisLevel === 'immediate') {
      systemPrompt += '\n\nCRITICAL ALERT: This user appears to be in IMMEDIATE DANGER with specific plans. Your response MUST:\n- Prioritize their immediate safety above all else\n- Ask them to call 911 or go to emergency room RIGHT NOW\n- Provide crisis hotline numbers (988, 741741)\n- Ask them to stay with a trusted person\n- Be direct, caring, and urgent\n- DO NOT engage in regular therapy - focus entirely on safety';
    } else if (crisisLevel === 'severe') {
      systemPrompt += '\n\nCRISIS ALERT: This user is expressing serious suicidal thoughts. Your response MUST:\n- Acknowledge their pain with deep empathy\n- Immediately provide crisis resources (988, 741741)\n- Ask directly about their safety and plans\n- Encourage immediate professional help\n- Stay with them until they connect with help\n- Show that their life has value';
    } else if (crisisLevel === 'moderate') {
      systemPrompt += '\n\nCONCERN ALERT: This user is showing signs of self-harm or moderate distress. Your response should:\n- Validate their feelings with extra care\n- Gently provide crisis resources\n- Assess their immediate safety\n- Offer specific coping strategies\n- Encourage professional support';
    }

    let conversationHistory = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Include more conversation history for better context (last 20 messages)
    if (messages && messages.length > 0) {
      const recentMessages = messages.slice(-20).map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));
      conversationHistory.push(...recentMessages);
    }

    // Add the current user message
    conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    // If conversation is getting very long, create a summary to maintain context
    if (conversationHistory.length > 25) {
      // Create a summary of the earlier conversation
      const oldMessages = conversationHistory.slice(1, -15); // Skip system prompt and keep recent 15
      const messageSummary = oldMessages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join(' | ');
      
      const summaryPrompt = `Previous conversation summary: The user has discussed: ${messageSummary}`;
      
      // Rebuild with summary + recent messages
      conversationHistory = [
        conversationHistory[0], // System prompt
        { role: 'system', content: summaryPrompt },
        ...conversationHistory.slice(-15) // Recent 15 messages + current
      ];
    }

    // Call OpenAI API with enhanced parameters for better memory
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using the more cost-effective model
      messages: conversationHistory,
      max_tokens: 600, // Increased for more detailed responses
      temperature: 0.7, // Slightly creative but still professional
      presence_penalty: 0.2, // Encourage varied responses and prevent repetition
      frequency_penalty: 0.1, // Reduce repetition
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Return the AI response with crisis information
    return NextResponse.json({
      message: aiResponse,
      isCrisis: hasCrisisIndicators,
      crisisLevel: crisisLevel,
      matchedKeywords: matchedKeywords,
      requiresIntervention: crisisLevel === 'immediate' || crisisLevel === 'severe'
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback response if AI fails
    const fallbackResponse = 
      "I'm here to listen and support you. While I'm experiencing some technical difficulties right now, " +
      "your feelings and experiences are important. If you're in crisis, please reach out to the National Suicide Prevention Lifeline at 988 " +
      "or text HOME to 741741 for immediate support. Can you tell me more about what's on your mind?";

    return NextResponse.json({
      message: fallbackResponse,
      isCrisis: false,
      fallback: true
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
