import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";

export default function StartCall({ 
  configId, 
  accessToken, 
  selectedScript 
}: { 
  configId?: string; 
  accessToken: string; 
  selectedScript?: {script: string, title: string} | null;
}) {
  const { status, connect } = useVoice();

  const canStartCall = selectedScript !== null;

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed bottom-4 right-4 z-50"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0, scale: 0.8 },
            enter: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
          }}
        >
          <div className="flex flex-col items-end gap-2">
            {!canStartCall && (
              <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                Choose a sales script first
              </div>
            )}
            <Button
              className={"flex items-center gap-1.5 rounded-full"}
              disabled={!canStartCall}
              onClick={() => {
                if (!canStartCall) return;
                  const systemPrompt = selectedScript ? 
                    `You are an AI sales coach helping a sales representative practice their skills. They are working on: "${selectedScript.title}".
                    
Context: ${selectedScript.script}

Your role:
- Act as a potential customer/prospect in this scenario
- Respond naturally and realistically as someone in this situation would
- Provide brief coaching feedback after their pitch attempts
- Be encouraging but honest about areas for improvement
- Help them practice objection handling and closing techniques

Stay in character as the prospect, but occasionally provide coaching tips like "That was confident!" or "Try slowing down when mentioning the price."` :
                    "You are an AI sales coach. Help the user practice their sales skills with realistic conversation and coaching feedback.";

                  connect({ 
                    auth: { type: "accessToken", value: accessToken },
                    configId,
                    sessionSettings: {
                      type: "voice_chat",
                      systemPrompt: systemPrompt
                    }
                  })
                    .then(() => {})
                    .catch(() => {
                      toast.error("Unable to start call");
                    })
                    .finally(() => {});
                }}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50 fill-current"}
                    strokeWidth={0}
                  />
                </span>
                <span>Start Practice Session</span>
              </Button>
            </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
