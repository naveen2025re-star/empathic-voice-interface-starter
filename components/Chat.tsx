"use client";

import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import SalesScriptSelector from "./SalesScriptSelector";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting
const SalesMetrics = dynamic(() => import("./SalesMetrics"), {
  loading: () => <div className="w-80 border-l bg-muted/20 animate-pulse" />,
  ssr: false
});

const CoachingFeedback = dynamic(() => import("./CoachingFeedback"), {
  loading: () => <div className="h-4 bg-muted animate-pulse rounded" />,
  ssr: false
});
import { AuthenticatedNav } from "./AuthenticatedNav";
import { ComponentRef, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { calculateSalesMetrics, generateCoachingFeedback } from "@/utils/salesCoaching";
import { saveSession, SessionData, getSessionHistory } from "@/utils/sessionStorage";
import type { SalesMetrics as SalesMetricsType } from "@/utils/salesCoaching";
const SessionPrep = dynamic(() => import("@/components/coaching/SessionPrep").then(mod => ({ default: mod.SessionPrep })), {
  loading: () => <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"><div className="w-full max-w-2xl bg-card rounded-lg animate-pulse h-96" /></div>,
  ssr: false
});

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [selectedScript, setSelectedScript] = useState<{script: string, title: string} | null>(null);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
  
  const handleScriptSelect = (script: string, title: string) => {
    setSelectedScript({ script, title });
  };

  return (
    <>
      <AuthenticatedNav />
      <div className="relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px] pt-14">
        <VoiceProvider
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onError={(error) => {
          toast.error(error.message);
        }}
      >
        <SalesCoachingSession 
          selectedScript={selectedScript}
          onScriptSelect={handleScriptSelect}
          configId={configId}
          accessToken={accessToken}
          messagesRef={ref}
        />
        </VoiceProvider>
      </div>
    </>
  );
}

const SalesCoachingSession = ({
  selectedScript,
  onScriptSelect,
  configId,
  accessToken,
  messagesRef
}: {
  selectedScript: {script: string, title: string} | null;
  onScriptSelect: (script: string, title: string) => void;
  configId?: string;
  accessToken: string;
  messagesRef: React.RefObject<HTMLDivElement>;
}) => {
  const { status, fft, messages } = useVoice();
  const isConnected = status.value === "connected";
  
  // Get recent performance for personalized prep
  useEffect(() => {
    const loadRecentScore = async () => {
      try {
        const sessions = await getSessionHistory();
        if (sessions.length > 0) {
          const lastSession = sessions[sessions.length - 1];
          setRecentScore(Math.round(lastSession.averageMetrics.overall_score * 100));
        }
      } catch (error) {
        console.error('Error loading recent score:', error);
      }
    };
    loadRecentScore();
  }, []);
  
  // Session tracking state
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [allMetrics, setAllMetrics] = useState<SalesMetricsType[]>([]);
  const [allFeedback, setAllFeedback] = useState<string[]>([]);
  const [recentScore, setRecentScore] = useState<number | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  
  // Reset session prep when script changes
  useEffect(() => {
    setSessionReady(false);
  }, [selectedScript?.title]);

  // Get the latest user message emotions for coaching feedback
  const userMessages = messages?.filter(m => m.type === 'user_message') || [];
  const latestUserMessage = userMessages[userMessages.length - 1];
  const emotionsData = latestUserMessage?.models?.prosody?.scores || {};
  
  // Track session start/end and collect data
  useEffect(() => {
    if (isConnected && !sessionStartTime) {
      setSessionStartTime(Date.now());
      setAllMetrics([]);
      setAllFeedback([]);
    } else if (!isConnected && sessionStartTime && selectedScript) {
      // Session ended, save the data
      const handleSessionEnd = async () => {
        const sessionDuration = Date.now() - sessionStartTime;
      
        if (allMetrics.length > 0 && sessionDuration > 10000) { // Only save sessions longer than 10 seconds
        const averageMetrics = {
          confidence: allMetrics.reduce((sum, m) => sum + m.confidence, 0) / allMetrics.length,
          enthusiasm: allMetrics.reduce((sum, m) => sum + m.enthusiasm, 0) / allMetrics.length,
          persuasiveness: allMetrics.reduce((sum, m) => sum + m.persuasiveness, 0) / allMetrics.length,
          authenticity: allMetrics.reduce((sum, m) => sum + m.authenticity, 0) / allMetrics.length,
          nervousness: allMetrics.reduce((sum, m) => sum + m.nervousness, 0) / allMetrics.length,
          overall_score: allMetrics.reduce((sum, m) => sum + m.overall_score, 0) / allMetrics.length
        };
        
        // Create conversation summary
        const conversationSummary = {
          keyPoints: [
            `Practiced ${selectedScript.title}`,
            `${userMessages.length} interactions completed`,
            `Average confidence: ${Math.round(averageMetrics.confidence * 100)}%`
          ],
          improvements: allFeedback.filter(f => f.includes('improvement')).slice(0, 3),
          strengths: allFeedback.filter(f => f.includes('Great') || f.includes('Excellent')).slice(0, 3)
        };
        
        await saveSession({
          duration: sessionDuration,
          scriptTitle: selectedScript.title,
          scriptContent: selectedScript.script,
          messageCount: userMessages.length,
          averageMetrics,
          coachingFeedback: Array.from(new Set(allFeedback)), // Remove duplicates
          conversationSummary
        });
        
        toast.success(`Practice session saved! Duration: ${Math.round(sessionDuration / 60000)}m ${Math.round((sessionDuration % 60000) / 1000)}s`, {
          description: `Score: ${Math.round(averageMetrics.overall_score)}% | ${userMessages.length} interactions`,
          duration: 4000
        });
        }
        
        setSessionStartTime(null);
        // Reset session prep for next session
        setSessionReady(false);
      };
      
      handleSessionEnd();
    }
  }, [isConnected, sessionStartTime, selectedScript, allMetrics, allFeedback, userMessages.length]);
  
  // Collect metrics from each user message
  useEffect(() => {
    if (emotionsData && Object.keys(emotionsData).length > 0) {
      const metrics = calculateSalesMetrics(emotionsData);
      setAllMetrics(prev => [...prev, metrics]);
      
      // Collect coaching feedback
      const feedback = generateCoachingFeedback(emotionsData);
      const feedbackMessages = feedback.map(f => f.message);
      setAllFeedback(prev => [...prev, ...feedbackMessages]);
    }
  }, [latestUserMessage]); // Trigger when a new message arrives

  return (
    <>
      <SalesScriptSelector 
        onScriptSelect={onScriptSelect} 
        isConnected={isConnected}
      />
      
      {selectedScript && (
        <div className="p-4 bg-primary/5 border-b">
          <h3 className="font-semibold text-sm mb-1 text-primary">Practicing: {selectedScript.title}</h3>
          <p className="text-sm text-muted-foreground">{selectedScript.script}</p>
          <div className="mt-2 text-xs text-primary/80">
            💡 The AI coach will adapt to this scenario and provide relevant feedback
          </div>
        </div>
      )}
      
      <div className="flex-1 flex">
        <div className="flex-1">
          <Messages ref={messagesRef} />
        </div>
        
        {isConnected && emotionsData && Object.keys(emotionsData).length > 0 && (
          <div className="w-80 border-l bg-muted/20">
            <SalesMetrics values={emotionsData} />
          </div>
        )}
      </div>
      
      <Controls />
      {/* Show session prep before allowing connection */}
      {selectedScript && !sessionReady && !isConnected && (
        <SessionPrep
          scriptTitle={selectedScript.title}
          recentScore={recentScore ?? undefined}
          onStartSession={() => {
            setSessionReady(true);
          }}
        />
      )}
      
      {/* Only show StartCall after session prep is complete and not connected */}
      {sessionReady && !isConnected && (
        <StartCall 
          configId={configId} 
          accessToken={accessToken} 
          selectedScript={selectedScript}
        />
      )}
      
      {/* Real-time coaching feedback */}
      <CoachingFeedback 
        emotions={emotionsData} 
        isVisible={isConnected && Object.keys(emotionsData).length > 0}
      />
    </>
  );
};
