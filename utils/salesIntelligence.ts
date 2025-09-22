// AI Sales Agent Intelligence Engine
// Transforms Hume AI emotion data into actionable sales insights

export interface EmotionScores {
  excitement?: number;
  interest?: number;
  confusion?: number;
  skepticism?: number;
  anxiety?: number;
  confidence?: number;
  satisfaction?: number;
  frustration?: number;
}

export interface SalesIntent {
  level: 'COLD' | 'WARM' | 'HOT';
  score: number;
  confidence: number;
  nextAction: string;
  reasoning: string;
}

export interface LeadProfile {
  intent: SalesIntent;
  emotionSummary: string;
  suggestedApproach: string;
  conversionProbability: number;
  timestamps: {
    firstInteraction: Date;
    lastActivity: Date;
    engagementDuration: number;
  };
}

// Smart emotion-to-sales-intent mapping
export function analyzeSalesIntent(emotions: EmotionScores, conversationLength: number): SalesIntent {
  const excitementWeight = (emotions.excitement || 0) * 0.4;
  const interestWeight = (emotions.interest || 0) * 0.3;
  const confidenceWeight = (emotions.confidence || 0) * 0.2;
  const satisfactionWeight = (emotions.satisfaction || 0) * 0.1;
  
  // Negative emotion penalties
  const confusionPenalty = (emotions.confusion || 0) * -0.3;
  const skepticismPenalty = (emotions.skepticism || 0) * -0.2;
  const frustrationPenalty = (emotions.frustration || 0) * -0.4;
  const anxietyPenalty = (emotions.anxiety || 0) * -0.1;
  
  // Engagement bonus (longer conversations = higher intent)
  const engagementBonus = Math.min(conversationLength / 10, 0.3);
  
  const rawScore = excitementWeight + interestWeight + confidenceWeight + satisfactionWeight +
    confusionPenalty + skepticismPenalty + frustrationPenalty + anxietyPenalty + engagementBonus;
  
  const score = Math.max(0, Math.min(100, rawScore * 100));
  const confidence = calculateConfidence(emotions);
  
  let level: 'COLD' | 'WARM' | 'HOT';
  let nextAction: string;
  let reasoning: string;
  
  if (score >= 70) {
    level = 'HOT';
    nextAction = 'IMMEDIATE_CLOSE';
    reasoning = 'High excitement/interest with strong engagement - ready to buy';
  } else if (score >= 40) {
    level = 'WARM';
    nextAction = 'QUALIFY_AND_NURTURE';
    reasoning = 'Showing positive interest but needs more convincing';
  } else {
    level = 'COLD';
    nextAction = 'EDUCATE_AND_BUILD_TRUST';
    reasoning = 'Low engagement or negative emotions - focus on value building';
  }
  
  return { level, score, confidence, nextAction, reasoning };
}

function calculateConfidence(emotions: EmotionScores): number {
  // Higher confidence when emotions are clear (not neutral)
  const emotionIntensity = Object.values(emotions).reduce((sum, val) => sum + Math.abs(val || 0), 0);
  return Math.min(95, emotionIntensity * 100);
}

// Sales conversation templates based on emotion state
export function getSalesPrompt(intent: SalesIntent, emotions: EmotionScores): string {
  const { level, nextAction } = intent;
  
  if (level === 'HOT') {
    if ((emotions.excitement || 0) > 0.6) {
      return "I can sense your excitement about this! Since you're clearly interested, would you like me to help you get started right away? I can walk you through our sign-up process or answer any final questions.";
    }
    return "You seem really engaged with what we offer. What's the best way I can help you move forward today? Would you prefer a demo call or should we discuss pricing?";
  }
  
  if (level === 'WARM') {
    if ((emotions.confusion || 0) > 0.5) {
      return "I notice you might have some questions - that's totally normal! What specific aspect would you like me to clarify? I'm here to make sure everything makes perfect sense.";
    }
    if ((emotions.skepticism || 0) > 0.4) {
      return "I understand you want to make sure this is the right fit - smart approach! What concerns do you have? I'd love to address them and share how we've helped similar customers.";
    }
    return "You're showing great interest! What would help you feel more confident about moving forward? I can share success stories, arrange a demo, or discuss your specific needs.";
  }
  
  // COLD leads
  if ((emotions.frustration || 0) > 0.4) {
    return "I sense some frustration - I'm here to help make things easier! What's the biggest challenge you're facing right now? Let me see how we can solve that together.";
  }
  
  return "Welcome! I'm here to understand exactly what you need and show you how we can help. What brought you here today? What problem are you trying to solve?";
}

// Lead qualification questions based on intent level
export function getQualificationQuestions(intent: SalesIntent): string[] {
  const { level } = intent;
  
  if (level === 'HOT') {
    return [
      "What's your timeline for implementing this solution?",
      "What's your budget range for this type of solution?",
      "Who else is involved in the decision-making process?",
      "What would make this a definite yes for you?"
    ];
  }
  
  if (level === 'WARM') {
    return [
      "What's your biggest challenge in this area?",
      "Have you tried other solutions before? What didn't work?",
      "How urgent is solving this problem for you?",
      "What would success look like for you?"
    ];
  }
  
  return [
    "What industry are you in?",
    "What's your current process for handling this?",
    "What made you start looking for a solution?",
    "How familiar are you with this type of solution?"
  ];
}

// Conversion actions based on intent
export function getConversionActions(intent: SalesIntent): Array<{
  type: 'demo' | 'trial' | 'purchase' | 'consultation' | 'content';
  priority: 'high' | 'medium' | 'low';
  message: string;
  buttonText: string;
}> {
  const { level } = intent;
  
  if (level === 'HOT') {
    return [
      {
        type: 'purchase',
        priority: 'high',
        message: "Ready to get started? Let's get you set up right now!",
        buttonText: "Start Now - Special Offer"
      },
      {
        type: 'demo',
        priority: 'high',
        message: "Want to see exactly how this works for your situation?",
        buttonText: "Book Demo Call"
      }
    ];
  }
  
  if (level === 'WARM') {
    return [
      {
        type: 'demo',
        priority: 'high',
        message: "See how this works with a personalized demo",
        buttonText: "Schedule Demo"
      },
      {
        type: 'trial',
        priority: 'medium',
        message: "Try it risk-free for 14 days",
        buttonText: "Start Free Trial"
      }
    ];
  }
  
  return [
    {
      type: 'content',
      priority: 'medium',
      message: "Get our free guide to solving this problem",
      buttonText: "Download Guide"
    },
    {
      type: 'consultation',
      priority: 'low',
      message: "Get personalized advice for your situation",
      buttonText: "Free Consultation"
    }
  ];
}

export function calculateROI(intent: SalesIntent, averageDealSize: number): number {
  const conversionRates = {
    HOT: 0.45,   // 45% close rate for hot leads
    WARM: 0.18,  // 18% close rate for warm leads  
    COLD: 0.03   // 3% close rate for cold leads
  };
  
  return averageDealSize * conversionRates[intent.level] * (intent.confidence / 100);
}