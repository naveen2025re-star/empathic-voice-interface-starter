"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ErrorBoundary } from "./ErrorBoundary";
import { ComponentRef, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

  // Memoized scroll function to prevent re-renders
  const scrollToBottom = useCallback(() => {
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
  }, []);

  // Memoized error handler
  const handleError = useCallback((error: any) => {
    console.error("Voice error:", error);
    toast.error(`Connection error: ${error.message || 'Unknown error'}`);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) {
        window.clearTimeout(timeout.current);
      }
    };
  }, []);
  
  return (
    <div className="pt-16 relative grow flex flex-col mx-auto w-full max-w-screen-lg px-4 pb-8 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
      <ErrorBoundary>
        <VoiceProvider
          onMessage={scrollToBottom}
          onError={handleError}
        >
          <Messages ref={ref} />
          <Controls />
          <StartCall configId={configId} accessToken={accessToken} />
        </VoiceProvider>
      </ErrorBoundary>
    </div>
  );
}
