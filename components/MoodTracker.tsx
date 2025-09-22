"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Smile, Frown, Meh, Heart, TrendingUp, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MoodEntry {
  id: string;
  mood: 'happy' | 'sad' | 'neutral' | 'anxious' | 'calm';
  intensity: number;
  timestamp: Date;
  notes?: string;
}

interface MoodTrackerProps {
  isVisible: boolean;
  onClose: () => void;
}

const moodIcons = {
  happy: { icon: Smile, color: "text-green-500", label: "Happy" },
  sad: { icon: Frown, color: "text-blue-500", label: "Sad" },
  neutral: { icon: Meh, color: "text-gray-500", label: "Neutral" },
  anxious: { icon: Heart, color: "text-red-500", label: "Anxious" },
  calm: { icon: TrendingUp, color: "text-purple-500", label: "Calm" }
};

export function MoodTracker({ isVisible, onClose }: MoodTrackerProps) {
  const [currentMood, setCurrentMood] = useState<keyof typeof moodIcons | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  // Load mood history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindspace-mood-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setMoodHistory(parsed);
      } catch (error) {
        console.error('Error loading mood history:', error);
      }
    }
  }, []);

  // Save mood history to localStorage only with consent
  useEffect(() => {
    const consent = localStorage.getItem('mindspace-data-consent');
    if (moodHistory.length > 0 && consent === 'true') {
      localStorage.setItem('mindspace-mood-history', JSON.stringify(moodHistory));
    }
  }, [moodHistory]);

  const logMood = () => {
    if (!currentMood) return;

    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      mood: currentMood,
      intensity,
      timestamp: new Date()
    };

    setMoodHistory(prev => [newEntry, ...prev.slice(0, 29)]); // Keep last 30 entries
    setCurrentMood(null);
    setIntensity(5);
  };

  const getRecentTrend = () => {
    if (moodHistory.length < 2) return null;
    
    const recent = moodHistory.slice(0, 5);
    
    // Map moods to valence scores (positive/negative/neutral)
    const moodValence = {
      happy: 1,
      calm: 1,
      neutral: 0,
      sad: -1,
      anxious: -1
    };
    
    // Calculate weighted mood score (valence * intensity)
    const weightedScore = recent.reduce((sum, entry) => {
      const valence = moodValence[entry.mood];
      return sum + (valence * entry.intensity);
    }, 0) / recent.length;
    
    if (weightedScore > 3) return { 
      trend: "improving", 
      message: "Your mood has been trending upward lately! 🌟" 
    };
    if (weightedScore < -3) return { 
      trend: "concerning", 
      message: "I notice you've been experiencing some difficult emotions. Remember, I'm here to support you, and reaching out for help is always okay." 
    };
    return { 
      trend: "stable", 
      message: "Your mood seems balanced. Keep taking care of yourself." 
    };
  };

  if (!isVisible) return null;

  const trend = getRecentTrend();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="therapeutic-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="size-5 text-primary" />
                    Mood Check-in
                  </CardTitle>
                  <CardDescription>
                    Track your emotional wellness journey
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Current Mood Selection */}
              <div className="space-y-4">
                <h3 className="font-medium">How are you feeling right now?</h3>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(moodIcons).map(([mood, config]) => {
                    const Icon = config.icon;
                    const isSelected = currentMood === mood;
                    
                    return (
                      <Button
                        key={mood}
                        variant={isSelected ? "default" : "outline"}
                        className={`h-20 flex-col gap-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setCurrentMood(mood as keyof typeof moodIcons)}
                      >
                        <Icon className={`size-6 ${isSelected ? 'text-primary-foreground' : config.color}`} />
                        <span className="text-xs">{config.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Intensity Slider */}
              {currentMood && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <h3 className="font-medium">How intense is this feeling? (1-10)</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Mild</span>
                      <span className="font-medium">{intensity}/10</span>
                      <span>Intense</span>
                    </div>
                  </div>
                  
                  <Button onClick={logMood} className="w-full therapeutic-button">
                    Log Mood
                  </Button>
                </motion.div>
              )}

              {/* Trend Insight */}
              {trend && (
                <div className="therapeutic-accent p-4">
                  <h3 className="font-medium text-sm mb-2">Recent Insight</h3>
                  <p className="text-sm text-muted-foreground">{trend.message}</p>
                </div>
              )}

              {/* Recent History */}
              {moodHistory.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="size-4" />
                      Recent Entries
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all mood history? This cannot be undone.")) {
                          setMoodHistory([]);
                          localStorage.removeItem('mindspace-mood-history');
                        }
                      }}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Clear History
                    </Button>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {moodHistory.slice(0, 10).map((entry) => {
                      const config = moodIcons[entry.mood];
                      const Icon = config.icon;
                      
                      return (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className={`size-4 ${config.color}`} />
                            <span className="text-sm font-medium">{config.label}</span>
                            <Badge variant="secondary" className="text-xs">
                              {entry.intensity}/10
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}