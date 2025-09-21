// Sales coaching utilities for EmotiClose
export interface SalesMetrics {
  confidence: number;
  enthusiasm: number;
  nervousness: number;
  persuasiveness: number;
  authenticity: number;
  overall_score: number;
}

export interface CoachingFeedback {
  message: string;
  type: 'positive' | 'warning' | 'improvement';
  category: 'confidence' | 'delivery' | 'energy' | 'authenticity';
}

// Calculate sales-relevant metrics from Hume emotions
export const calculateSalesMetrics = (emotions: Record<string, number>): SalesMetrics => {
  const confidence = Math.max(0, (
    (emotions.determination || 0) * 0.4 +
    (emotions.contentment || 0) * 0.3 +
    (emotions.satisfaction || 0) * 0.3 -
    (emotions.anxiety || 0) * 0.4 -
    (emotions.doubt || 0) * 0.3 -
    (emotions.nervousness || 0) * 0.3
  ));

  const enthusiasm = Math.max(0, (
    (emotions.excitement || 0) * 0.4 +
    (emotions.joy || 0) * 0.3 +
    (emotions.interest || 0) * 0.3
  ));

  const nervousness = Math.max(0, (
    (emotions.anxiety || 0) * 0.4 +
    (emotions.awkwardness || 0) * 0.3 +
    (emotions.embarrassment || 0) * 0.3
  ));

  const persuasiveness = Math.max(0, (
    (emotions.admiration || 0) * 0.3 +
    (emotions.interest || 0) * 0.3 +
    (emotions.determination || 0) * 0.4
  ));

  const authenticity = Math.max(0, (
    (emotions.contentment || 0) * 0.4 +
    (emotions.calmness || 0) * 0.3 +
    (emotions.satisfaction || 0) * 0.3 -
    (emotions.confusion || 0) * 0.2
  ));

  const overall_score = (confidence + enthusiasm + persuasiveness + authenticity - nervousness * 0.5) / 4;

  return {
    confidence: Math.min(1, Math.max(0, confidence)),
    enthusiasm: Math.min(1, Math.max(0, enthusiasm)),
    nervousness: Math.min(1, Math.max(0, nervousness)),
    persuasiveness: Math.min(1, Math.max(0, persuasiveness)),
    authenticity: Math.min(1, Math.max(0, authenticity)),
    overall_score: Math.min(1, Math.max(0, overall_score))
  };
};

// Generate coaching feedback based on emotions
export const generateCoachingFeedback = (emotions: Record<string, number>): CoachingFeedback[] => {
  const metrics = calculateSalesMetrics(emotions);
  const feedback: CoachingFeedback[] = [];

  // Confidence feedback
  if (metrics.confidence < 0.3) {
    feedback.push({
      message: "Your confidence seems low. Try speaking slower and emphasizing key points.",
      type: 'improvement',
      category: 'confidence'
    });
  } else if (metrics.confidence > 0.7) {
    feedback.push({
      message: "Great confidence! Your conviction is coming through clearly.",
      type: 'positive',
      category: 'confidence'
    });
  }

  // Enthusiasm feedback
  if (metrics.enthusiasm < 0.3) {
    feedback.push({
      message: "Add more energy to your delivery. Your passion for the product should shine through.",
      type: 'improvement',
      category: 'energy'
    });
  } else if (metrics.enthusiasm > 0.7) {
    feedback.push({
      message: "Excellent energy! Your enthusiasm is engaging and compelling.",
      type: 'positive',
      category: 'energy'
    });
  }

  // Nervousness feedback
  if (metrics.nervousness > 0.5) {
    feedback.push({
      message: "Take a deep breath and pause. Nervousness can undermine your message.",
      type: 'warning',
      category: 'delivery'
    });
  }

  // Persuasiveness feedback
  if (metrics.persuasiveness < 0.4) {
    feedback.push({
      message: "Focus on building rapport and showing genuine interest in the customer's needs.",
      type: 'improvement',
      category: 'authenticity'
    });
  }

  return feedback;
};

// Enhanced scenario system with buyer personas, industries, and difficulty levels
export interface BuyerPersona {
  id: string;
  name: string;
  description: string;
  traits: string[];
  responseStyle: string;
  challenges: string[];
  objections: string[];
}

export interface SalesScenario {
  title: string;
  script: string;
  industry: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  persona: string;
  objectives: string[];
  commonObjections: string[];
  successMetrics: {
    confidence: number;
    enthusiasm: number;
    persuasiveness: number;
  };
  aiCoachingTips: string[];
  estimatedDuration: string;
}

// Buyer Personas
export const buyerPersonas: Record<string, BuyerPersona> = {
  friendly: {
    id: "friendly",
    name: "The Friendly Collaborator",
    description: "Relationship-focused, easy to talk to, values partnership approach",
    traits: ["Relationship-oriented", "Collaborative", "Partnership-minded"],
    responseStyle: "Engaging, asks questions about your company, builds rapport naturally",
    challenges: ["Maintaining professionalism", "Moving to close", "Avoiding over-familiarity"],
    objections: ["Let me think about it", "I need to discuss with my team", "The timing isn't quite right"]
  },
  skeptical: {
    id: "skeptical",
    name: "The Skeptical Decision Maker",
    description: "Cautious, analytical, needs strong proof and evidence",
    traits: ["Data-driven", "Risk-averse", "Thorough researcher"],
    responseStyle: "Will challenge claims, ask for case studies, and scrutinize details",
    challenges: ["Trust building", "Overcoming doubt", "Providing concrete proof"],
    objections: ["How do I know this works?", "What's your track record?", "This seems too good to be true"]
  },
  budgetConscious: {
    id: "budgetConscious", 
    name: "The Budget-Conscious Buyer",
    description: "Price-sensitive, focused on ROI and cost justification",
    traits: ["Cost-focused", "ROI-driven", "Needs financial justification"],
    responseStyle: "Will negotiate price, ask about cheaper alternatives, focus on value",
    challenges: ["Demonstrating value", "Cost justification", "Competitive pricing"],
    objections: ["This is too expensive", "What's your best price?", "We don't have budget for this"]
  },
  technical: {
    id: "technical",
    name: "The Technical Evaluator", 
    description: "Detail-oriented, focused on features, integration, and technical specs",
    traits: ["Feature-focused", "Integration-conscious", "Specification-driven"],
    responseStyle: "Will ask technical questions, discuss implementation, and evaluate features",
    challenges: ["Technical depth", "Integration concerns", "Feature comparison"],
    objections: ["Does this integrate with our stack?", "What about security?", "How does this compare to X?"]
  }
};

// Sales script templates (backward compatible with current system)
export const salesScriptTemplates = {
  coldCall: {
    title: "Cold Call Opening",
    script: "Hi [Name], this is [Your Name] from [Company]. I know I'm calling out of the blue, but I noticed [specific observation about their business]. We've helped similar companies [specific benefit]. Do you have 30 seconds for me to explain how this might help you too?"
  },
  productDemo: {
    title: "Product Demo Introduction",
    script: "Thank you for your time today. Before I show you our solution, let me ask - what's the biggest challenge you're facing with [relevant area]? Perfect, let me show you exactly how we can solve that..."
  },
  objectionHandling: {
    title: "Price Objection Response",
    script: "I understand price is a concern. Let me ask you this - what would it cost your business if this problem isn't solved in the next 6 months? Our solution typically pays for itself within [timeframe] through [specific benefits]."
  },
  closing: {
    title: "Assumptive Close",
    script: "Based on everything we've discussed, it sounds like this solution would really help your team achieve [their goal]. What questions do you have before we move forward?"
  }
};

// Advanced role-playing scenarios with buyer personas, industries, and difficulty levels
export const advancedSalesScenarios: Record<string, SalesScenario> = {
  // BEGINNER LEVEL - Build foundational skills
  friendlyColdCall: {
    title: "Warm Cold Call - Friendly Prospect",
    script: "Hi [Name], this is [Your Name] from [Company]. I know I'm calling out of the blue, but I noticed [specific observation about their business]. We've helped similar companies [specific benefit]. Do you have 30 seconds for me to explain how this might help you too?",
    industry: "general",
    difficulty: "beginner",
    persona: "friendly",
    objectives: ["Build rapport", "Generate interest", "Secure next conversation"],
    commonObjections: ["I'm busy right now", "Can you send me information?", "What exactly do you do?"],
    successMetrics: { confidence: 0.7, enthusiasm: 0.8, persuasiveness: 0.6 },
    aiCoachingTips: ["Speak clearly and confidently", "Smile while talking", "Use their name 2-3 times"],
    estimatedDuration: "2-3 minutes"
  },

  saasProductDemo: {
    title: "SaaS Product Demo - Collaborative Client",
    script: "Thank you for your time today. Before I show you our solution, let me ask - what's your biggest challenge with [current process]? Perfect, let me show you exactly how we can solve that and save your team hours each week...",
    industry: "saas",
    difficulty: "beginner",
    persona: "friendly",
    objectives: ["Understand needs", "Demonstrate value", "Create excitement"],
    commonObjections: ["This looks complicated", "How long does setup take?", "What if it doesn't work for us?"],
    successMetrics: { confidence: 0.8, enthusiasm: 0.8, persuasiveness: 0.7 },
    aiCoachingTips: ["Ask questions before presenting", "Focus on their specific pain points", "Use 'you' language"],
    estimatedDuration: "3-4 minutes"
  },

  // INTERMEDIATE LEVEL - Handle resistance and objections
  budgetObjectionHandling: {
    title: "Budget Objection - Cost-Conscious Buyer",
    script: "I understand price is a concern. Let me ask you this - what would it cost your business if this problem isn't solved in the next 6 months? Our solution typically pays for itself within [timeframe] through [specific benefits]. Can we explore the ROI together?",
    industry: "general",
    difficulty: "intermediate",
    persona: "budgetConscious",
    objectives: ["Address price concerns", "Demonstrate ROI", "Reframe value proposition"],
    commonObjections: ["It's too expensive", "We don't have budget", "Your competitor is cheaper"],
    successMetrics: { confidence: 0.8, enthusiasm: 0.6, persuasiveness: 0.9 },
    aiCoachingTips: ["Stay calm and confident", "Ask questions to understand the real concern", "Focus on value not price"],
    estimatedDuration: "4-5 minutes"
  },

  healthcareCompliance: {
    title: "Healthcare Compliance Discussion",
    script: "I understand compliance is your top priority in healthcare. Our solution is HIPAA-compliant, SOC 2 certified, and used by [similar healthcare organizations]. Let me walk you through our security framework and how we handle patient data protection...",
    industry: "healthcare",
    difficulty: "intermediate",
    persona: "technical",
    objectives: ["Address compliance concerns", "Demonstrate security", "Build trust through expertise"],
    commonObjections: ["What about HIPAA compliance?", "How do you handle data security?", "We need more security details"],
    successMetrics: { confidence: 0.9, enthusiasm: 0.6, persuasiveness: 0.8 },
    aiCoachingTips: ["Know your compliance certifications", "Speak with authority on security", "Provide specific examples"],
    estimatedDuration: "5-6 minutes"
  },

  // EXPERT LEVEL - Complex sales situations
  skepticalClosing: {
    title: "Complex Close - Skeptical Decision Maker",
    script: "I know you're naturally cautious about new solutions, and that's smart. Based on our discussion, you mentioned [specific pain point] is costing you [specific impact]. Our [similar client] saw [specific results] within [timeframe]. What specific evidence would you need to feel confident moving forward?",
    industry: "enterprise",
    difficulty: "expert",
    persona: "skeptical",
    objectives: ["Address skepticism", "Provide proof", "Close with confidence"],
    commonObjections: ["We need more time to evaluate", "How do I know this will work?", "What's your track record?"],
    successMetrics: { confidence: 0.9, enthusiasm: 0.7, persuasiveness: 0.9 },
    aiCoachingTips: ["Address objections before they're raised", "Use specific case studies", "Stay confident under pressure"],
    estimatedDuration: "6-8 minutes"
  },

  financialRiskAssessment: {
    title: "Financial Services Risk Discussion",
    script: "I know risk management is crucial in your role. Our platform has helped firms like [similar company] reduce operational risk by 40% while ensuring full regulatory compliance. Let me show you how our risk analytics would apply to your specific portfolio and current market conditions...",
    industry: "financial",
    difficulty: "expert",
    persona: "technical",
    objectives: ["Address risk concerns", "Demonstrate compliance", "Show quantifiable benefits"],
    commonObjections: ["What about regulatory compliance?", "How do you validate risk models?", "We have our own risk systems"],
    successMetrics: { confidence: 0.9, enthusiasm: 0.6, persuasiveness: 0.9 },
    aiCoachingTips: ["Use industry-specific terminology", "Quote specific metrics and outcomes", "Address regulatory concerns proactively"],
    estimatedDuration: "7-10 minutes"
  },

  realEstateInvestment: {
    title: "Commercial Real Estate Investment Pitch",
    script: "This property represents a unique opportunity in the [location] market. With [specific metrics] and our projected 5-year growth of [percentage], this aligns perfectly with your investment criteria of [their criteria]. Let me walk through the numbers and market analysis that support this recommendation...",
    industry: "realestate", 
    difficulty: "expert",
    persona: "skeptical",
    objectives: ["Present investment case", "Handle due diligence questions", "Create urgency"],
    commonObjections: ["The market is uncertain", "I need to see more comps", "What about the risks?"],
    successMetrics: { confidence: 0.9, enthusiasm: 0.8, persuasiveness: 0.9 },
    aiCoachingTips: ["Know your market data cold", "Address risks proactively", "Create appropriate urgency"],
    estimatedDuration: "8-10 minutes"
  }
};

// Objection handling library with smart responses
export const objectionLibrary = {
  price: {
    "It's too expensive": [
      "I understand price is a consideration. What's most important to you - the upfront cost or the long-term value?",
      "Let's look at this as an investment. What would solving this problem be worth to your business?",
      "Many of our clients felt the same way initially. Can I show you how this pays for itself?"
    ],
    "We don't have budget": [
      "I appreciate you being upfront about budget. When would budget typically become available?",
      "Let's explore the cost of not solving this problem. What's that costing you currently?",
      "Many companies find budget when they see the ROI. Can we explore that together?"
    ],
    "Your competitor is cheaper": [
      "You're right, there are cheaper options. What factors beyond price are important to your decision?",
      "Price is just one factor. What would you need to see to justify the investment in quality?",
      "Our clients often tell us we're not the cheapest, but we're the best value. Here's why..."
    ]
  },
  timing: {
    "Not the right time": [
      "I understand timing is important. What would need to change for it to be the right time?",
      "When you say timing, are you referring to budget, resources, or something else?",
      "Many clients have said that, but found the cost of waiting was higher than acting now."
    ],
    "Need to think about it": [
      "That makes sense. What specific aspects do you need to think through?",
      "I'd be happy to help you think through this. What are your main considerations?",
      "Thinking it through is wise. What information would help you make the best decision?"
    ]
  },
  authority: {
    "Need to discuss with team": [
      "That's a great approach. Who else would be involved in this decision?",
      "I'd love to help you present this to your team. What concerns might they have?",
      "Absolutely. What information would be most helpful for your team discussion?"
    ],
    "Boss needs to approve": [
      "That makes sense. What criteria does your boss typically use for these decisions?",
      "I'd be happy to help you build the business case. What matters most to them?",
      "What information would your boss need to feel confident about this decision?"
    ]
  },
  product: {
    "Not sure it will work for us": [
      "That's a fair concern. What specifically are you unsure about?",
      "Let me show you how we've solved similar challenges for companies like yours.",
      "What would need to happen for you to feel confident this would work?"
    ],
    "Too complicated": [
      "I understand it might seem complex at first. Let me show you how simple it is to use.",
      "Our goal is to make this as simple as possible. What seems most complicated to you?",
      "Many clients felt that way initially. Here's how we make the implementation seamless..."
    ]
  }
};