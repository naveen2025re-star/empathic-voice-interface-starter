"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import SalesPanel from "./SalesPanel";
import { ComponentRef, useRef, useState } from "react";
import { toast } from "sonner";

interface Lead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest_level: number;
  qualification_score: number;
  notes: string[];
  created_at: Date;
}

export default function SalesAgent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [conversationMode, setConversationMode] = useState<'discovery' | 'qualification' | 'demo' | 'closing'>('discovery');
  const [salesMetrics, setSalesMetrics] = useState({
    totalCalls: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
    avgCallDuration: 0
  });

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  // Initialize a new lead when conversation starts
  const initializeNewLead = () => {
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      interest_level: 0,
      qualification_score: 0,
      notes: [],
      created_at: new Date()
    };
    setCurrentLead(newLead);
  };

  // Update lead based on conversation analysis
  const updateLeadFromConversation = (emotions: any, message: string) => {
    if (!currentLead) return;

    // Analyze emotions for interest level
    const interestSignals = ['joy', 'interest', 'excitement'];
    const concernSignals = ['confusion', 'skepticism', 'boredom'];
    
    let interestScore = 0;
    if (emotions) {
      interestSignals.forEach(signal => {
        if (emotions[signal]) interestScore += emotions[signal];
      });
      concernSignals.forEach(signal => {
        if (emotions[signal]) interestScore -= emotions[signal];
      });
    }

    // Update lead with new information
    setCurrentLead(prev => ({
      ...prev!,
      interest_level: Math.max(0, Math.min(100, prev!.interest_level + interestScore * 10)),
      notes: [...prev!.notes, `${new Date().toISOString()}: ${message.slice(0, 100)}...`]
    }));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Sales Interface */}
      <div className="flex-1 flex flex-col">
        <VoiceProvider
          onMessage={(message) => {
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

            // Analyze message for sales insights
            if (message.type === 'user_message' && currentLead) {
              updateLeadFromConversation(
                message.models?.prosody?.scores, 
                typeof message.message.content === 'string' ? message.message.content : ''
              );
            }
          }}
          onError={(error) => {
            toast.error(error.message);
          }}
          onOpen={() => {
            initializeNewLead();
            setSalesMetrics(prev => ({ ...prev, totalCalls: prev.totalCalls + 1 }));
          }}
        >
          <div className="flex-1 flex">
            {/* Chat Interface */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <Messages ref={ref} />
              <Controls />
              <StartCall 
                configId={configId} 
                accessToken={accessToken}
              />
            </div>

            {/* Sales Panel */}
            <div className="w-80 border-l border-border bg-card">
              <SalesPanel 
                currentLead={currentLead}
                conversationMode={conversationMode}
                onModeChange={setConversationMode}
                salesMetrics={salesMetrics}
              />
            </div>
          </div>
        </VoiceProvider>
      </div>
    </div>
  );
}