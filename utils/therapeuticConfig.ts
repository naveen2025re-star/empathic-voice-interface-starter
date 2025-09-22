import therapeuticPrompts from '../config/therapeutic-prompts.json';

export interface TherapeuticConfig {
  systemPrompt: string;
  conversationStarters: string[];
  emotionResponses: Record<string, string[]>;
  copingStrategies: Record<string, string>;
  crisisResources: Record<string, string>;
  boundaries: string[];
  encouragement: string[];
}

export const getTherapeuticConfig = (): TherapeuticConfig => {
  return therapeuticPrompts as TherapeuticConfig;
};

export const getRandomConversationStarter = (): string => {
  const starters = therapeuticPrompts.conversationStarters;
  return starters[Math.floor(Math.random() * starters.length)];
};

export const getEmotionResponse = (emotion: string): string => {
  const emotionKey = emotion.toLowerCase() as keyof typeof therapeuticPrompts.emotionResponses;
  const responses = therapeuticPrompts.emotionResponses[emotionKey];
  if (!responses || responses.length === 0) {
    // Default empathetic response
    return "I can hear that you're experiencing some strong emotions right now. I'm here to listen and support you.";
  }
  return responses[Math.floor(Math.random() * responses.length)];
};

export const getCopingStrategy = (strategyType: string): string => {
  const strategyKey = strategyType as keyof typeof therapeuticPrompts.copingStrategies;
  return therapeuticPrompts.copingStrategies[strategyKey] || 
    "Let's take a moment to breathe together and center ourselves.";
};

export const getRandomEncouragement = (): string => {
  const encouragements = therapeuticPrompts.encouragement;
  return encouragements[Math.floor(Math.random() * encouragements.length)];
};

// Safety check for crisis indicators
export const detectCrisisLanguage = (text: string): string | null => {
  const crisisKeywords = {
    suicidal_ideation: ['kill myself', 'end it all', 'don\'t want to live', 'suicide', 'better off dead'],
    domestic_violence: ['he hits me', 'she hurts me', 'afraid to go home', 'domestic violence'],
    substance_abuse: ['can\'t stop drinking', 'drug problem', 'addiction', 'overdose'],
    eating_disorders: ['starving myself', 'binge and purge', 'eating disorder', 'hate my body']
  };

  for (const [crisis, keywords] of Object.entries(crisisKeywords)) {
    if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
      return crisis;
    }
  }
  
  return null;
};

export const getCrisisResource = (crisisType: string): string => {
  const crisisKey = crisisType as keyof typeof therapeuticPrompts.crisisResources;
  return therapeuticPrompts.crisisResources[crisisKey] || 
    "If you're in crisis, please reach out to emergency services at 911 or a crisis helpline for immediate support.";
};