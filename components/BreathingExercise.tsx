"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BreathingExerciseProps {
  isVisible: boolean;
  onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const exercises = {
  box: {
    name: "Box Breathing",
    description: "4-4-4-4 pattern for anxiety relief",
    phases: [
      { phase: 'inhale' as BreathingPhase, duration: 4, instruction: "Breathe In" },
      { phase: 'hold' as BreathingPhase, duration: 4, instruction: "Hold" },
      { phase: 'exhale' as BreathingPhase, duration: 4, instruction: "Breathe Out" },
      { phase: 'rest' as BreathingPhase, duration: 4, instruction: "Rest" }
    ]
  },
  calm: {
    name: "4-7-8 Breathing",
    description: "Deep relaxation technique",
    phases: [
      { phase: 'inhale' as BreathingPhase, duration: 4, instruction: "Breathe In" },
      { phase: 'hold' as BreathingPhase, duration: 7, instruction: "Hold" },
      { phase: 'exhale' as BreathingPhase, duration: 8, instruction: "Breathe Out" }
    ]
  },
  energy: {
    name: "Energizing Breath",
    description: "Quick breathing for alertness",
    phases: [
      { phase: 'inhale' as BreathingPhase, duration: 3, instruction: "Breathe In" },
      { phase: 'exhale' as BreathingPhase, duration: 3, instruction: "Breathe Out" }
    ]
  }
};

export function BreathingExercise({ isVisible, onClose }: BreathingExerciseProps) {
  const [selectedExercise, setSelectedExercise] = useState<keyof typeof exercises>('box');
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercise = exercises[selectedExercise];
  const currentPhase = exercise.phases[currentPhaseIndex];

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            const nextPhaseIndex = (currentPhaseIndex + 1) % exercise.phases.length;
            setCurrentPhaseIndex(nextPhaseIndex);
            
            // If we completed a full cycle, increment counter
            if (nextPhaseIndex === 0) {
              setCycleCount(prev => prev + 1);
            }
            
            return exercise.phases[nextPhaseIndex].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, secondsLeft, currentPhaseIndex, exercise.phases]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setSecondsLeft(exercise.phases[0].duration);
    setCycleCount(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setSecondsLeft(0);
    setCycleCount(0);
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    
    const progress = (currentPhase.duration - secondsLeft) / currentPhase.duration;
    
    switch (currentPhase.phase) {
      case 'inhale':
        return 1 + (progress * 0.8); // Expand
      case 'exhale':
        return 1.8 - (progress * 0.8); // Contract
      case 'hold':
      case 'rest':
        return currentPhase.phase === 'hold' ? 1.8 : 1; // Stay expanded or contracted
      default:
        return 1;
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase?.phase) {
      case 'inhale':
        return 'from-blue-400 to-blue-600';
      case 'hold':
        return 'from-purple-400 to-purple-600';
      case 'exhale':
        return 'from-green-400 to-green-600';
      case 'rest':
        return 'from-gray-400 to-gray-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <Card className="therapeutic-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="size-5 text-primary" />
                    Breathing Exercise
                  </CardTitle>
                  <CardDescription>
                    Guided breathing for relaxation and focus
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Exercise Selection */}
              {!isActive && (
                <div className="space-y-4">
                  <h3 className="font-medium">Choose an exercise:</h3>
                  <div className="grid gap-3">
                    {Object.entries(exercises).map(([key, ex]) => (
                      <Button
                        key={key}
                        variant={selectedExercise === key ? "default" : "outline"}
                        className="justify-start h-auto p-4"
                        onClick={() => setSelectedExercise(key as keyof typeof exercises)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{ex.name}</div>
                          <div className="text-sm text-muted-foreground">{ex.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Breathing Circle */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <motion.div
                    className={`absolute inset-8 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20`}
                    animate={{ scale: getCircleScale() }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  />
                  <motion.div
                    className={`absolute inset-16 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-40`}
                    animate={{ scale: getCircleScale() }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  />
                  <motion.div
                    className={`w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center text-white shadow-lg`}
                    animate={{ scale: getCircleScale() * 0.5 + 0.5 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                  >
                    <div className="text-center">
                      {isActive && (
                        <>
                          <div className="text-lg font-medium">{currentPhase.instruction}</div>
                          <div className="text-2xl font-bold">{secondsLeft}</div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Instructions */}
                {isActive && (
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">{currentPhase.instruction}</p>
                    <p className="text-sm text-muted-foreground">
                      Cycle {cycleCount} • {exercise.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                {!isActive ? (
                  <Button onClick={startExercise} className="therapeutic-button flex items-center gap-2">
                    <Play className="size-4" />
                    Start Exercise
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseExercise} variant="outline" size="sm">
                      <Pause className="size-4" />
                    </Button>
                    <Button onClick={resetExercise} variant="outline" size="sm">
                      <RotateCcw className="size-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Completion Message */}
              {cycleCount >= 3 && isActive && (
                <motion.div
                  className="therapeutic-accent p-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm font-medium">Great job! You've completed {cycleCount} breathing cycles.</p>
                  <p className="text-xs text-muted-foreground mt-1">Continue for as long as feels comfortable.</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}