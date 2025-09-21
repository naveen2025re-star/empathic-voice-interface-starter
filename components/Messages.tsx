"use client";
import { cn } from "@/utils";
import { useVoice } from "@humeai/voice-react";
import Expressions from "./Expressions";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentRef, forwardRef, memo, useMemo } from "react";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(_, ref) {
  const { messages } = useVoice();

  // Memoize filtered messages for performance
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => 
      msg.type === "user_message" || msg.type === "assistant_message"
    );
  }, [messages]);

  return (
    <motion.div
      layoutScroll
      className={"grow overflow-auto p-4 pt-24 custom-scrollbar"}
      ref={ref}
      style={{
        // Hardware acceleration for smooth scrolling
        transform: 'translateZ(0)',
        willChange: 'scroll-position'
      }}
    >
      <motion.div
        className={"max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"}
      >
        <AnimatePresence mode={"popLayout"}>
          {filteredMessages.map((msg, index) => (
                <motion.div
                  key={`${msg.type}-${index}`}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded-xl",
                    msg.type === "user_message" ? "ml-auto" : ""
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  style={{
                    // GPU acceleration
                    transform: 'translateZ(0)',
                    willChange: 'transform, opacity'
                  }}
                >
                  <div className={"flex items-center justify-between pt-4 px-3"}>
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none opacity-50 tracking-tight"
                      )}
                    >
                      {msg.message.role}
                    </div>
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none opacity-50 tracking-tight"
                      )}
                    >
                      {msg.receivedAt.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        second: undefined,
                      })}
                    </div>
                  </div>
                  <div className={"pb-3 px-3"}>{msg.message.content}</div>
                  <Expressions values={{ ...msg.models.prosody?.scores }} />
                </motion.div>
              ))
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

// Memoize the component to prevent unnecessary re-renders
export default memo(Messages);
