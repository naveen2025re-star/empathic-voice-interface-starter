"use client";

import { VoiceProvider, useVoice } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import SalesScriptSelector from "./SalesScriptSelector";
import SalesMetrics from "./SalesMetrics";
import CoachingFeedback from "./CoachingFeedback";
import { ComponentRef, useRef, useState } from "react";
import { toast } from "sonner";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [selectedScript, setSelectedScript] = useState<{script: string, title: string} | null>(null);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
  
  const handleScriptSelect = (script: string, title: string) => {
    setSelectedScript({ script, title });
  };

  return (
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
  messagesRef: ComponentRef<typeof Messages> | null;
}) => {
  const { status, fft, messages } = useVoice();
  const isConnected = status.value === "connected";

  // Get the latest user message emotions for coaching feedback
  const userMessages = messages?.filter(m => m.type === 'user_message') || [];
  const latestUserMessage = userMessages[userMessages.length - 1];
  const emotionsData = latestUserMessage?.models?.prosody?.scores || {};

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
      <StartCall 
        configId={configId} 
        accessToken={accessToken} 
        selectedScript={selectedScript} 
      />
      
      {/* Real-time coaching feedback */}
      <CoachingFeedback 
        emotions={emotionsData} 
        isVisible={isConnected && Object.keys(emotionsData).length > 0}
      />
    </>
  );
};
