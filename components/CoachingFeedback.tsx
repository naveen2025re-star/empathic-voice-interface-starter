"use client";
import { generateCoachingFeedback, CoachingFeedback as ICoachingFeedback } from "@/utils/salesCoaching";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, TrendingUp, Lightbulb, X } from "lucide-react";
import { useState, useEffect } from "react";

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
    if (isVisible) {
      // Always generate feedback when visible, even with limited emotion data
      const newFeedback = generateCoachingFeedback(emotions);
      
      // Send feedback to parent component for sidebar display
      onFeedbackUpdate?.(newFeedback);
      setRecentTips(newFeedback);
    }
  }, [emotions, isVisible, onFeedbackUpdate]);

  // This component now only handles toast notifications
  // The main feedback display is handled by the sidebar
  return null;
}

