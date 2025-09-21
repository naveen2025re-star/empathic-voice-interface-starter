"use client";

import { useState, useEffect } from "react";
import Chat from "@/components/Chat";
import { WelcomeGuide } from "@/components/onboarding/WelcomeGuide";

interface ClientWrapperProps {
  accessToken: string;
}

export function ClientWrapper({ accessToken }: ClientWrapperProps) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if this is a first-time user
    const hasSeenWelcome = localStorage.getItem('emoticlose_welcome_shown');
    const hasAnySessions = localStorage.getItem('emoticlose_sessions');
    
    if (!hasSeenWelcome && !hasAnySessions) {
      setShowWelcome(true);
    }
    setIsLoading(false);
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem('emoticlose_welcome_shown', 'true');
    setShowWelcome(false);
  };

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Chat accessToken={accessToken} />
      {showWelcome && <WelcomeGuide onComplete={handleWelcomeComplete} />}
    </>
  );
}