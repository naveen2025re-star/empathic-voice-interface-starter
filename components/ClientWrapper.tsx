"use client";

import { useState, useEffect } from "react";
import ClientComponent from "@/components/Chat";
import { WelcomeGuide } from "@/components/onboarding/WelcomeGuide";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/hooks/useAuth";

interface ClientWrapperProps {
  accessToken: string;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
    </div>
  );
}

function AuthenticatedApp({ accessToken }: { accessToken: string }) {
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
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ClientComponent accessToken={accessToken} />
      {showWelcome && <WelcomeGuide onComplete={handleWelcomeComplete} />}
    </div>
  );
}

export function ClientWrapper({ accessToken }: ClientWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <AuthenticatedApp accessToken={accessToken} />;
}