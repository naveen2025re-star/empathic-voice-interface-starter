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

// Sales script templates
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