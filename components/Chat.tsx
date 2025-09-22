"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import SalesIntelligence from "./SalesIntelligence";
import HybridChatInput from "./HybridChatInput";
import StripeCheckout from "./StripeCheckout";
import { ComponentRef, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { type EmotionScores, analyzeSalesIntent, getSalesPrompt } from "@/utils/salesIntelligence";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  
  // Sales Intelligence State
  const [conversationEmotions, setConversationEmotions] = useState<EmotionScores>({});
  const [emotionSum, setEmotionSum] = useState<Record<string, number>>({});
  const [emotionCount, setEmotionCount] = useState<Record<string, number>>({});
  const [conversationLength, setConversationLength] = useState(0);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [showSalesIntelligence, setShowSalesIntelligence] = useState(false);
  
  // Show sales intelligence after sufficient conversation
  useEffect(() => {
    if (conversationLength > 2 && !showSalesIntelligence) {
      setShowSalesIntelligence(true);
    }
  }, [conversationLength, showSalesIntelligence]);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
  
  // Stripe checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState(99);
  const [checkoutTitle, setCheckoutTitle] = useState("Purchase");
  
  // Sales Action Handler with real integrations
  const handleSalesAction = (action: string, data?: any) => {
    switch (action) {
      case 'demo':
        toast.success("Demo booking opened! 📅");
        window.open('https://calendly.com/ai-sales-agent-demo', '_blank');
        break;
      case 'trial':
        toast.success("Free trial started! 🚀");
        window.open('/signup?trial=true', '_blank');
        break;
      case 'purchase':
        const amount = data?.amount || 99;
        const title = data?.title || "Complete Purchase";
        setCheckoutAmount(amount);
        setCheckoutTitle(title);
        setShowCheckout(true);
        break;
      case 'consultation':
        toast.success("Consultation scheduled! 👥");
        window.open('https://calendly.com/ai-sales-agent-consultation', '_blank');
        break;
      case 'content':
        toast.success("Guide download started! 📄");
        window.open('/download-guide', '_blank');
        break;
      default:
        toast.info("Sales action triggered!");
    }
  };
  
  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        onMessage={(message) => {
          // Scroll handling
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
          
          // Sales Intelligence: Extract emotion data from messages
          if (message && 'models' in message && message.models?.prosody?.scores) {
            const emotionScores = message.models.prosody.scores;
            
            // Better emotion aggregation with sum and count tracking
            Object.entries(emotionScores).forEach(([emotion, score]) => {
              setEmotionSum(prev => ({
                ...prev,
                [emotion]: (prev[emotion] || 0) + (score as number)
              }));
              setEmotionCount(prev => ({
                ...prev,
                [emotion]: (prev[emotion] || 0) + 1
              }));
            });
            
            // Calculate proper averages
            setConversationEmotions(prev => {
              const updated: EmotionScores = {};
              Object.keys(emotionScores).forEach(emotion => {
                const sum = emotionSum[emotion] || 0;
                const count = emotionCount[emotion] || 1;
                updated[emotion as keyof EmotionScores] = (sum + (emotionScores[emotion] as number)) / (count + 1);
              });
              return updated;
            });
            
            // Track conversation length
            setConversationLength(prev => prev + 1);
          }
          
          // Update message list for sales intelligence
          setAllMessages(prev => [...prev, message]);
        }}
        onError={(error) => {
          toast.error(error.message);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
        
        {/* Hybrid Chat Input */}
        <HybridChatInput 
          onTextMessage={(message) => {
            // Handle text messages through voice provider or separately
            toast.info(`Text message: ${message.slice(0, 50)}...`);
          }}
        />
        
        {/* Sales Intelligence Panel */}
        {showSalesIntelligence && Object.keys(conversationEmotions).length > 0 && (
          <SalesIntelligence
            emotions={conversationEmotions}
            conversationLength={conversationLength}
            messages={allMessages}
            onSalesAction={handleSalesAction}
          />
        )}
        
        {/* Stripe Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <StripeCheckout
              amount={checkoutAmount}
              title={checkoutTitle}
              onSuccess={() => {
                setShowCheckout(false);
                toast.success("Payment completed successfully!");
              }}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        )}
      </VoiceProvider>
    </div>
  );
}
