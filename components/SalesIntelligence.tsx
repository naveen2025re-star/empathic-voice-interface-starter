"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, DollarSign, MessageCircle, Clock } from 'lucide-react';
import { analyzeSalesIntent, getSalesPrompt, getConversionActions, calculateROI, type EmotionScores, type SalesIntent, type LeadProfile } from '@/utils/salesIntelligence';
import { Button } from './ui/button';
import { cn } from '@/utils';

interface SalesIntelligenceProps {
  emotions: EmotionScores;
  conversationLength: number;
  messages: any[];
  onSalesAction?: (action: string, data?: any) => void;
}

export function SalesIntelligence({ 
  emotions, 
  conversationLength, 
  messages,
  onSalesAction 
}: SalesIntelligenceProps) {
  const [intent, setIntent] = useState<SalesIntent | null>(null);
  const [engagementScore, setEngagementScore] = useState(0);
  const [roi, setROI] = useState(0);
  const [startTime] = useState(new Date());
  
  useEffect(() => {
    if (Object.keys(emotions).length > 0) {
      const salesIntent = analyzeSalesIntent(emotions, conversationLength);
      setIntent(salesIntent);
      
      // Calculate engagement score based on conversation activity
      const engagement = Math.min(100, (conversationLength * 10) + (messages.length * 5));
      setEngagementScore(engagement);
      
      // Calculate potential ROI (using $1,200 as average deal size)
      const potentialROI = calculateROI(salesIntent, 1200);
      setROI(potentialROI);
    }
  }, [emotions, conversationLength, messages]);

  if (!intent) return null;

  const getIntentColor = (level: string) => {
    switch (level) {
      case 'HOT': return 'text-red-500 bg-red-50 dark:bg-red-950/20';
      case 'WARM': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'COLD': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getIntentIcon = (level: string) => {
    switch (level) {
      case 'HOT': return <Zap className="size-4" />;
      case 'WARM': return <Target className="size-4" />;
      case 'COLD': return <MessageCircle className="size-4" />;
      default: return <TrendingUp className="size-4" />;
    }
  };

  const conversionActions = getConversionActions(intent);
  const engagementDuration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-80 bg-card/95 backdrop-blur border rounded-lg shadow-lg p-4 z-40"
    >
      <div className="space-y-3">
        {/* Lead Status Header */}
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium", getIntentColor(intent.level))}>
            {getIntentIcon(intent.level)}
            <span>{intent.level} LEAD</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <Clock className="size-3 inline mr-1" />
            {Math.floor(engagementDuration / 60)}m {engagementDuration % 60}s
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-lg">{Math.round(intent.score)}</div>
            <div className="text-muted-foreground">Intent Score</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg">{engagementScore}</div>
            <div className="text-muted-foreground">Engagement</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg flex items-center justify-center">
              <DollarSign className="size-3" />
              {Math.round(roi)}
            </div>
            <div className="text-muted-foreground">Est. Value</div>
          </div>
        </div>

        {/* Sales Insights */}
        <div className="bg-background/50 rounded p-2 text-xs">
          <div className="font-medium mb-1">Sales Insight:</div>
          <div className="text-muted-foreground">{intent.reasoning}</div>
        </div>

        {/* Quick Actions */}
        {conversionActions.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs font-medium">Recommended Actions:</div>
            {conversionActions.slice(0, 2).map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.priority === 'high' ? 'default' : 'outline'}
                className="w-full text-xs h-8"
                onClick={() => onSalesAction?.(action.type, action)}
              >
                {action.buttonText}
              </Button>
            ))}
          </div>
        )}

        {/* Emotion Summary */}
        <div className="text-xs text-muted-foreground">
          <strong>Top Emotions:</strong> {
            Object.entries(emotions)
              .sort(([,a], [,b]) => (b || 0) - (a || 0))
              .slice(0, 3)
              .map(([emotion, score]) => `${emotion} (${Math.round((score || 0) * 100)}%)`)
              .join(', ')
          }
        </div>
      </div>
    </motion.div>
  );
}

export default SalesIntelligence;