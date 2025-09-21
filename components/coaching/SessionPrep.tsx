"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface SessionPrepProps {
  scriptTitle: string;
  onStartSession: () => void;
  recentScore?: number;
}

export function SessionPrep({ scriptTitle, onStartSession, recentScore }: SessionPrepProps) {
  const [currentTip, setCurrentTip] = useState(0);
  const [showPrep, setShowPrep] = useState(true);

  const getPersonalizedTips = () => {
    const baseTips = [
      "Take 3 deep breaths before starting to center yourself and project confidence",
      "Speak 10-15% slower than normal conversation to appear more authoritative",
      "Use the person's name 2-3 times during the conversation to build rapport",
      "Practice your opening line out loud 3 times before beginning"
    ];

    const improvementTips = [];
    
    if (recentScore && recentScore < 60) {
      improvementTips.push(
        "Focus on enthusiasm - smile while speaking, it comes through in your voice",
        "Project confidence by standing up during your practice session"
      );
    } else if (recentScore && recentScore < 80) {
      improvementTips.push(
        "Work on persuasiveness by emphasizing key benefit words",
        "Practice handling objections with confident, measured responses"
      );
    } else {
      improvementTips.push(
        "You're performing well! Focus on consistency and natural flow",
        "Challenge yourself with longer, more complex scenarios"
      );
    }

    return [...baseTips, ...improvementTips];
  };

  const tips = getPersonalizedTips();
  const sessionGoals = [
    "Maintain 70%+ confidence throughout the conversation",
    "Show genuine enthusiasm for the product/service",
    "Use persuasive language that resonates with the prospect",
    "Stay authentic while being professional"
  ];

  const quickWarmUps = [
    "Practice tongue twisters for 30 seconds",
    "Do vocal scales: 'Do-Re-Mi-Fa-So-La-Ti-Do'",
    "Say 'Red leather, yellow leather' 5 times fast",
    "Hum your favorite song for 20 seconds"
  ];

  const handleStartSession = () => {
    setShowPrep(false);
    setTimeout(onStartSession, 300);
  };

  if (!showPrep) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Target className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Session Preparation</CardTitle>
              <p className="text-sm text-muted-foreground">Get ready to practice: {scriptTitle}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Performance Context */}
          {recentScore && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Your Recent Performance</p>
                <p className="text-xs text-muted-foreground">
                  Last session: {recentScore}% • 
                  {recentScore >= 80 ? " Excellent work!" : 
                   recentScore >= 60 ? " Good progress, let's improve!" : 
                   " Focus on the basics today"}
                </p>
              </div>
            </div>
          )}

          {/* Session Goals */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="size-4" />
              Today's Goals
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sessionGoals.map((goal, index) => (
                <Badge key={index} variant="outline" className="justify-start p-2 text-xs">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pre-Session Tips */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="size-4" />
              Personalized Tips
            </h4>
            <div className="space-y-2">
              {tips.slice(0, 3).map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Warm-up */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="size-4" />
              30-Second Voice Warm-up
            </h4>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Choose one:
              </p>
              <div className="space-y-1">
                {quickWarmUps.map((warmup, index) => (
                  <p key={index} className="text-xs text-green-700 dark:text-green-300">
                    • {warmup}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPrep(false)}
              className="flex-1"
            >
              Skip Prep
            </Button>
            <Button 
              onClick={handleStartSession}
              className="flex-1 flex items-center gap-2"
            >
              <Target className="size-4" />
              Start Practice Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}