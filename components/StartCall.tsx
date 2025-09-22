"use client";
import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";

export default function StartCall({ configId, accessToken }: { configId?: string, accessToken: string }) {
  const { status, connect } = useVoice();

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className={"fixed inset-0 p-4 flex items-center justify-center bg-background"}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Ready to talk?
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    I'm here to listen with empathy and understanding. Your conversation is private and judgment-free.
                  </p>
                </div>
                
                <Button
                  size="lg"
                  className={"therapeutic-button z-50 flex items-center gap-3 text-lg px-8 py-4"}
                  onClick={() => {
                    connect({ 
                      auth: { type: "accessToken", value: accessToken },
                      configId, 
                      // additional options can be added here
                      // like resumedChatGroupId and sessionSettings
                    })
                      .then(() => {})
                      .catch(() => {
                        toast.error("Unable to connect. Please try again.");
                      })
                      .finally(() => {});
                  }}
                >
                  <span>
                    <Phone
                      className={"size-5"}
                      strokeWidth={2}
                    />
                  </span>
                  <span>Start Conversation</span>
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>End-to-end encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span>No data stored</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
