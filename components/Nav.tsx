"use client";

import { Button } from "./ui/button";
import { Moon, Sun, Heart, Shield, BarChart3, Wind } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoodTracker } from "./MoodTracker";
import { BreathingExercise } from "./BreathingExercise";
import { PrivacyModal } from "./PrivacyModal";

export const Nav = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Only render theme-dependent content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={"fixed top-0 left-0 right-0 px-6 py-4 flex items-center justify-between h-16 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20"}>
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
          <Heart className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-lg text-foreground">MindSpace</h1>
          <p className="text-xs text-muted-foreground">Your AI Emotional Support Companion</p>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className={"flex items-center gap-2"}>
        <Button
          onClick={() => setShowMoodTracker(true)}
          variant={"ghost"}
          size={"sm"}
          className={"flex items-center gap-2 rounded-full text-muted-foreground hover:text-foreground"}
        >
          <BarChart3 className={"size-4"} />
          <span className="hidden sm:inline">Mood Check</span>
        </Button>
        <Button
          onClick={() => setShowBreathing(true)}
          variant={"ghost"}
          size={"sm"}
          className={"flex items-center gap-2 rounded-full text-muted-foreground hover:text-foreground"}
        >
          <Wind className={"size-4"} />
          <span className="hidden sm:inline">Breathe</span>
        </Button>
        <Button
          onClick={() => setShowPrivacy(true)}
          variant={"ghost"}
          size={"sm"}
          className={"flex items-center gap-2 rounded-full text-muted-foreground hover:text-foreground"}
        >
          <Shield className={"size-4"} />
          <span className="hidden sm:inline">Safe & Private</span>
        </Button>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant={"ghost"}
          size={"sm"}
          className={"flex items-center gap-2 rounded-full"}
        >
          <span>
            {!mounted ? (
              <Moon className={"size-4"} />
            ) : theme === "dark" ? (
              <Sun className={"size-4"} />
            ) : (
              <Moon className={"size-4"} />
            )}
          </span>
          <span className="hidden sm:inline">{!mounted ? "Dark" : theme === 'dark' ? "Light" : "Dark"} Mode</span>
        </Button>
      </div>
      
      <MoodTracker isVisible={showMoodTracker} onClose={() => setShowMoodTracker(false)} />
      <BreathingExercise isVisible={showBreathing} onClose={() => setShowBreathing(false)} />
      <PrivacyModal isVisible={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};
