"use client";
import { calculateSalesMetrics, SalesMetrics as ISalesMetrics, CoachingFeedback as ICoachingFeedback } from "@/utils/salesCoaching";
import { motion } from "framer-motion";
import { CSSProperties, memo, useMemo } from "react";
import { TrendingUp, TrendingDown, Zap, Heart, Shield, Target } from "lucide-react";
import CoachingTipsPanel from "./CoachingTipsPanel";

interface SalesMetricsProps {
  values: Record<string, number>;
  coachingTips?: ICoachingFeedback[];
}

const metricConfig = {
  confidence: {
    label: "Confidence",
    color: "#10b981",
    icon: TrendingUp,
    description: "How confident you sound"
  },
  enthusiasm: {
    label: "Enthusiasm", 
    color: "#f59e0b",
    icon: Zap,
    description: "Energy and excitement level"
  },
  persuasiveness: {
    label: "Persuasiveness",
    color: "#3b82f6", 
    icon: Target,
    description: "How compelling your message is"
  },
  authenticity: {
    label: "Authenticity",
    color: "#8b5cf6",
    icon: Heart,
    description: "How genuine you sound"
  },
  nervousness: {
    label: "Nervousness",
    color: "#ef4444",
    icon: TrendingDown,
    description: "Anxiety and uncertainty"
  }
};

function SalesMetrics({ values, coachingTips = [] }: SalesMetricsProps) {
  // Memoize metrics calculation for performance
  const metrics = useMemo(() => calculateSalesMetrics(values), [values]);
  
  // Memoize sorted metrics to prevent recalculation on every render
  const sortedMetrics = useMemo(() => {
    return Object.entries(metrics)
      .filter(([key]) => key !== 'overall_score' && key in metricConfig)
      .map(([key, value]) => ({
        key: key as keyof typeof metricConfig,
        value: key === 'nervousness' ? value : value,
        displayValue: key === 'nervousness' ? (1 - value) : value // Invert nervousness for display
      }))
      .sort((a, b) => b.displayValue - a.displayValue);
  }, [metrics]);

  return (
    <div className="p-4 w-full">
      {/* Overall Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span className="font-semibold text-primary">Sales Performance</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {Math.round(metrics.overall_score * 100)}%
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${metrics.overall_score * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="grid gap-3">
        {sortedMetrics.map(({ key, displayValue }) => {
          const config = metricConfig[key];
          const IconComponent = config.icon;
          
          return (
            <div key={key} className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <IconComponent 
                    className="size-4" 
                    style={{ color: config.color }}
                  />
                </div>
                <div>
                  <div className="font-medium text-sm">{config.label}</div>
                  <div className="text-xs text-muted-foreground">{config.description}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold tabular-nums">
                  {Math.round(displayValue * 100)}%
                </div>
                <div className="w-16 bg-muted rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${displayValue * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coaching Tips Section */}
      <div className="mt-6 pt-4 border-t">
        <CoachingTipsPanel tips={coachingTips} />
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(SalesMetrics);