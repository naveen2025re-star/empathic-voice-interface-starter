"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Mic, TrendingUp, Download, Play, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface WelcomeGuideProps {
  onComplete: () => void;
}

export function WelcomeGuide({ onComplete }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      icon: Target,
      title: "Welcome to EmotiClose!",
      description: "Your AI-powered sales coaching platform that analyzes emotional intelligence in real-time to help you master the art of persuasion.",
      tip: "Sales reps using AI coaching improve closing rates by 23% on average.",
      action: "Get Started"
    },
    {
      icon: Mic,
      title: "Practice with AI Coach",
      description: "Choose from proven sales scripts and practice your pitch. Our AI detects 57 emotions to give you instant feedback on confidence, enthusiasm, and persuasiveness.",
      tip: "Start with the 'Cold Call Introduction' - it's perfect for beginners!",
      action: "Start Practice"
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your improvement with detailed analytics, session history, and performance trends. See exactly what you're doing well and where to focus next.",
      tip: "Most users see improvement within their first 3 practice sessions.",
      action: "View Dashboard"
    },
    {
      icon: Download,
      title: "Share Your Success",
      description: "Export professional reports to share with managers or track your own development. Perfect for team meetings and personal goal setting.",
      tip: "Export weekly reports to track your monthly improvement goals.",
      action: "Finish Setup"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="w-full max-w-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                    >
                      {React.createElement(steps[currentStep].icon, { 
                        className: "size-8 text-primary" 
                      })}
                    </motion.div>
                  </div>
                </div>
                
                <CardTitle className="text-xl mb-2">{steps[currentStep].title}</CardTitle>
                
                <div className="flex justify-center gap-2 mb-4">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                  
                  <Badge variant="secondary" className="text-xs">
                    💡 Pro Tip: {steps[currentStep].tip}
                  </Badge>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip Tour
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex-1 flex items-center gap-2"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <CheckCircle className="size-4" />
                        {steps[currentStep].action}
                      </>
                    ) : (
                      <>
                        <Play className="size-4" />
                        {steps[currentStep].action}
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center text-xs text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}