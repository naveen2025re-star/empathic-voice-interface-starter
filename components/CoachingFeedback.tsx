"use client";
import { generateCoachingFeedback, CoachingFeedback as ICoachingFeedback } from "@/utils/salesCoaching";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, TrendingUp, Lightbulb, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CoachingFeedbackProps {
  emotions: Record<string, number>;
  isVisible: boolean;
  onFeedbackUpdate?: (feedback: ICoachingFeedback[]) => void;
}

const feedbackIcons = {
  positive: CheckCircle,
  warning: AlertTriangle,
  improvement: TrendingUp,
};

const categoryColors = {
  confidence: "text-blue-600",
  delivery: "text-purple-600", 
  energy: "text-orange-600",
  authenticity: "text-green-600",
};

export default function CoachingFeedback({ emotions, isVisible, onFeedbackUpdate }: CoachingFeedbackProps) {
  const [recentTips, setRecentTips] = useState<ICoachingFeedback[]>([]);

  useEffect(() => {
    console.log('🎯 CoachingFeedback: Effect triggered', { isVisible, emotions, emotionsCount: Object.keys(emotions).length });
    
    if (isVisible && Object.keys(emotions).length > 0) {
      console.log('🎯 CoachingFeedback: Generating feedback for emotions:', emotions);
      const newFeedback = generateCoachingFeedback(emotions);
      console.log('🎯 CoachingFeedback: Generated feedback:', newFeedback);
      
      if (newFeedback.length > 0) {
        console.log('🎯 CoachingFeedback: Sending feedback to parent component');
        // Send feedback to parent component for sidebar display
        onFeedbackUpdate?.(newFeedback);
        setRecentTips(newFeedback);
        
        // Show important tips as subtle toast notifications
        newFeedback.forEach((tip, index) => {
          if (tip.type === 'warning' || (tip.type === 'improvement' && Math.random() > 0.7)) {
            setTimeout(() => {
              toast(tip.message, {
                icon: tip.type === 'warning' ? '⚠️' : '💡',
                duration: 4000,
                position: 'top-right',
                className: 'text-sm',
                style: {
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--card-foreground))'
                }
              });
            }, index * 500);
          }
        });
      } else {
        console.log('🎯 CoachingFeedback: No feedback generated - trying fallback');
        // Force generate some feedback for testing
        const fallbackFeedback = [
          {
            message: "Try speaking with more confidence and energy.",
            type: 'improvement' as const,
            category: 'confidence' as const
          },
          {
            message: "Take a deep breath and slow down your pace.",
            type: 'warning' as const,
            category: 'delivery' as const
          }
        ];
        console.log('🎯 CoachingFeedback: Sending fallback feedback:', fallbackFeedback);
        onFeedbackUpdate?.(fallbackFeedback);
        setRecentTips(fallbackFeedback);
      }
    } else {
      console.log('🎯 CoachingFeedback: Not visible or no emotions data', { isVisible, emotionsCount: Object.keys(emotions).length });
    }
  }, [emotions, isVisible, onFeedbackUpdate]);

  // This component now only handles toast notifications
  // The main feedback display is handled by the sidebar
  return null;
}

