"use client";

export interface SalesTemplate {
  id: string;
  name: string;
  description: string;
  phase: 'discovery' | 'qualification' | 'demo' | 'closing';
  prompts: {
    opening: string;
    questions: string[];
    objection_handling: string[];
    closing: string;
  };
  emotional_triggers: string[];
}

export const SALES_TEMPLATES: SalesTemplate[] = [
  {
    id: 'saas_discovery',
    name: 'SaaS Discovery Call',
    description: 'Discover pain points and current solutions for SaaS prospects',
    phase: 'discovery',
    prompts: {
      opening: "Hi! I'm excited to learn more about your business and how we might be able to help you streamline your operations. Could you start by telling me a bit about your current role and what your biggest challenges are right now?",
      questions: [
        "What tools are you currently using to solve this problem?",
        "How much time does your team spend on this weekly?",
        "What's the biggest pain point with your current solution?",
        "Who else is involved in the decision-making process?",
        "What would an ideal solution look like for you?"
      ],
      objection_handling: [
        "I understand budget is a concern. Let's focus on the ROI - how much is this problem currently costing you?",
        "That's a fair point about timing. What would need to happen for this to become a priority?",
        "I hear that you're happy with your current solution. What would it take to make you consider switching?"
      ],
      closing: "Based on what you've shared, I think we have a solution that could really help. Would you be open to a 15-minute demo where I can show you exactly how this would work for your team?"
    },
    emotional_triggers: ['efficiency', 'cost_savings', 'time_freedom', 'competitive_advantage']
  },
  {
    id: 'real_estate_qualification',
    name: 'Real Estate Lead Qualification',
    description: 'Qualify potential home buyers and sellers',
    phase: 'qualification',
    prompts: {
      opening: "Hi! I understand you're interested in [buying/selling] a home. I'm here to help you through the process. Can you tell me a bit about what you're looking for?",
      questions: [
        "What's your ideal timeline for making a move?",
        "Have you been pre-approved for a mortgage?",
        "What's your budget range?",
        "What areas are you considering?",
        "Is this your first time buying/selling?",
        "What features are most important to you?"
      ],
      objection_handling: [
        "I understand the market seems volatile. Let me show you some recent trends that might put your mind at ease.",
        "Timing the market perfectly is impossible, but I can help you understand when it's right for your situation.",
        "I know there are many agents to choose from. What matters most to you in an agent?"
      ],
      closing: "I think I can definitely help you achieve your goals. Would you like to set up a time to see some properties that match your criteria?"
    },
    emotional_triggers: ['security', 'home_ownership', 'investment', 'family_stability']
  },
  {
    id: 'consulting_demo',
    name: 'Consulting Services Demo',
    description: 'Demonstrate value proposition for business consulting',
    phase: 'demo',
    prompts: {
      opening: "Thank you for taking the time to learn more about how we can help your business grow. I've prepared a customized presentation based on what you shared. Shall we dive in?",
      questions: [
        "Does this align with what you had in mind?",
        "How would implementing this impact your current workflow?",
        "What questions do you have about the process?",
        "Can you see this working with your team?",
        "What would success look like for you in 6 months?"
      ],
      objection_handling: [
        "I understand the investment seems significant. Let's look at the projected ROI based on your current metrics.",
        "Implementation does require some change management. I can show you how we've helped similar companies navigate this.",
        "You're right to be cautious about timeline. Let me show you our phased approach that minimizes disruption."
      ],
      closing: "Based on your feedback, this seems like a great fit. What would need to happen for us to move forward with a pilot program?"
    },
    emotional_triggers: ['growth', 'efficiency', 'competitive_edge', 'risk_mitigation']
  },
  {
    id: 'ecommerce_closing',
    name: 'E-commerce Platform Closing',
    description: 'Close deals for e-commerce platform subscriptions',
    phase: 'closing',
    prompts: {
      opening: "I'm excited that you're ready to take your online store to the next level! Let's go over the details and get you set up for success.",
      questions: [
        "Which plan best fits your current needs?",
        "Do you have any final questions about the features?",
        "When would you like to go live?",
        "Do you need help with migration from your current platform?",
        "Are there any additional integrations you'll need?"
      ],
      objection_handling: [
        "I understand you want to think it over. What specific concerns can I address right now?",
        "The pricing does include everything you need. Let me break down the value compared to your current costs.",
        "I hear you about the complexity. We provide full setup support and training. You won't be doing this alone."
      ],
      closing: "Perfect! Let's get your account set up today. I'll send over the agreement and we can have you live within 48 hours. Sound good?"
    },
    emotional_triggers: ['revenue_growth', 'scalability', 'professional_appearance', 'competitive_advantage']
  }
];

export function getSalesTemplateById(id: string): SalesTemplate | undefined {
  return SALES_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByPhase(phase: 'discovery' | 'qualification' | 'demo' | 'closing'): SalesTemplate[] {
  return SALES_TEMPLATES.filter(template => template.phase === phase);
}

export function getRandomQuestion(template: SalesTemplate): string {
  const questions = template.prompts.questions;
  return questions[Math.floor(Math.random() * questions.length)];
}

export function getRandomObjectionHandler(template: SalesTemplate): string {
  const handlers = template.prompts.objection_handling;
  return handlers[Math.floor(Math.random() * handlers.length)];
}