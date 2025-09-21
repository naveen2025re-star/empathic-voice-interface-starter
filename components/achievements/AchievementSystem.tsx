"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, TrendingUp, Zap, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { getSessionHistory } from "@/utils/sessionStorage";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: 'practice' | 'performance' | 'consistency' | 'improvement';
}

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);

  useEffect(() => {
    const sessions = getSessionHistory();
    const calculateAchievements = (): Achievement[] => {
      const totalSessions = sessions.length;
      const averageScore = sessions.length > 0 ? 
        sessions.reduce((sum, s) => sum + s.averageMetrics.overall_score, 0) / sessions.length : 0;
      const bestScore = sessions.length > 0 ? 
        Math.max(...sessions.map(s => s.averageMetrics.overall_score)) : 0;
      const consistentSessions = sessions.filter(s => s.averageMetrics.overall_score >= 70).length;
      
      const recentSessions = sessions.slice(-5);
      const improvementTrend = recentSessions.length >= 2 ? 
        recentSessions[recentSessions.length - 1].averageMetrics.overall_score - recentSessions[0].averageMetrics.overall_score : 0;

      return [
        {
          id: 'first_session',
          title: 'Getting Started',
          description: 'Complete your first practice session',
          icon: Target,
          requirement: 1,
          current: totalSessions,
          unlocked: totalSessions >= 1,
          category: 'practice'
        },
        {
          id: 'dedicated_learner',
          title: 'Dedicated Learner',
          description: 'Complete 5 practice sessions',
          icon: Star,
          requirement: 5,
          current: totalSessions,
          unlocked: totalSessions >= 5,
          category: 'practice'
        },
        {
          id: 'sales_pro',
          title: 'Sales Professional',
          description: 'Complete 20 practice sessions',
          icon: Trophy,
          requirement: 20,
          current: totalSessions,
          unlocked: totalSessions >= 20,
          category: 'practice'
        },
        {
          id: 'high_performer',
          title: 'High Performer',
          description: 'Achieve a score of 80% or higher',
          icon: Award,
          requirement: 80,
          current: Math.round(bestScore),
          unlocked: bestScore >= 80,
          category: 'performance'
        },
        {
          id: 'consistent_closer',
          title: 'Consistent Closer',
          description: 'Score 70%+ in 5 consecutive sessions',
          icon: TrendingUp,
          requirement: 5,
          current: consistentSessions,
          unlocked: consistentSessions >= 5,
          category: 'consistency'
        },
        {
          id: 'improvement_master',
          title: 'Improvement Master',
          description: 'Improve by 20+ points in recent sessions',
          icon: Zap,
          requirement: 20,
          current: Math.max(0, Math.round(improvementTrend)),
          unlocked: improvementTrend >= 20,
          category: 'improvement'
        }
      ];
    };

    const newAchievements = calculateAchievements();
    
    // Check for new unlocks
    const prevUnlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    const currentUnlocked = newAchievements.filter(a => a.unlocked).map(a => a.id);
    const newlyUnlocked = newAchievements.filter(a => 
      a.unlocked && !prevUnlocked.includes(a.id)
    );
    
    if (newlyUnlocked.length > 0) {
      setNewUnlocks(newlyUnlocked);
      // Auto-hide notification after 5 seconds
      setTimeout(() => setNewUnlocks([]), 5000);
    }
    
    setAchievements(newAchievements);
  }, []);

  const categoryColors = {
    practice: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    performance: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    consistency: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    improvement: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
  };

  return (
    <>
      {/* Achievement Notifications */}
      <AnimatePresence>
        {newUnlocks.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-20 right-4 z-50"
          >
            <Card className="w-80 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                    {React.createElement(achievement.icon, { 
                      className: "size-6 text-yellow-800 dark:text-yellow-200" 
                    })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Achievement Unlocked!
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {achievement.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Achievement Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0.6 }}
                animate={{ opacity: achievement.unlocked ? 1 : 0.6 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {React.createElement(achievement.icon, { 
                      className: `size-5 ${
                        achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                      }` 
                    })}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.title}
                    </h4>
                    <Badge variant="outline" className={`text-xs ${categoryColors[achievement.category]}`}>
                      {achievement.category}
                    </Badge>
                  </div>
                </div>
                
                <p className={`text-xs mb-3 ${
                  achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">
                      {Math.min(achievement.current, achievement.requirement)} / {achievement.requirement}
                    </span>
                    {achievement.unlocked && (
                      <Badge variant="default" className="text-xs">
                        ✓ Unlocked
                      </Badge>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div 
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (achievement.current / achievement.requirement) * 100)}%` 
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}