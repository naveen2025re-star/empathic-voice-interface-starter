"use client";
import { generateCoachingFeedback, CoachingFeedback as ICoachingFeedback } from "@/utils/salesCoaching";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

interface CoachingFeedbackProps {
  emotions: Record<string, number>;
  isVisible: boolean;
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

export default function CoachingFeedback({ emotions, isVisible }: CoachingFeedbackProps) {
  const [feedback, setFeedback] = useState<ICoachingFeedback[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (isVisible && Object.keys(emotions).length > 0) {
      const newFeedback = generateCoachingFeedback(emotions);
      setFeedback(newFeedback);
      
      if (newFeedback.length > 0) {
        setShowFeedback(true);
        // Auto-hide after 8 seconds
        setTimeout(() => setShowFeedback(false), 8000);
      }
    }
  }, [emotions, isVisible]);

  if (!isVisible || feedback.length === 0) return null;

  return (
    <AnimatePresence>
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40"
        >
          <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
            <div className="p-3 border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-primary" />
                <span className="font-medium text-sm text-primary">Coaching Tips</span>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="ml-auto text-muted-foreground hover:text-foreground text-sm"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
              {feedback.map((tip, index) => {
                const Icon = feedbackIcons[tip.type];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 p-2 rounded bg-muted/30"
                  >
                    <Icon className={`size-4 flex-shrink-0 mt-0.5 ${
                      tip.type === 'positive' ? 'text-green-600' :
                      tip.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div>
                      <div className={`text-xs font-medium ${categoryColors[tip.category]} uppercase tracking-wide`}>
                        {tip.category}
                      </div>
                      <div className="text-sm text-foreground mt-0.5">{tip.message}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}