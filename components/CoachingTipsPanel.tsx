"use client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { useState } from "react";
import { CoachingFeedback as ICoachingFeedback } from "@/utils/salesCoaching";

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

interface CoachingTipsPanelProps {
  tips: ICoachingFeedback[];
  className?: string;
}

export default function CoachingTipsPanel({ 
  tips, 
  className = "" 
}: CoachingTipsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (tips.length === 0) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lightbulb className="size-4" />
          <span>Coaching Tips</span>
        </div>
        <div className="text-xs text-muted-foreground p-2 rounded bg-muted/30">
          Start speaking to get personalized coaching tips!
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full"
      >
        <Lightbulb className="size-4" />
        <span>Coaching Tips</span>
        <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
          {tips.length}
        </span>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {tips.slice(0, 3).map((tip, index) => {
              const Icon = feedbackIcons[tip.type];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 p-2 rounded bg-card border text-xs"
                >
                  <Icon className={`size-3 flex-shrink-0 mt-0.5 ${
                    tip.type === 'positive' ? 'text-green-500' :
                    tip.type === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-medium ${categoryColors[tip.category]} uppercase tracking-wide mb-1`}>
                      {tip.category}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{tip.message}</div>
                  </div>
                </motion.div>
              );
            })}
            {tips.length > 3 && (
              <div className="text-xs text-muted-foreground text-center py-1">
                +{tips.length - 3} more tips available
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}