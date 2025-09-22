"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Send, MessageSquare, Volume2 } from "lucide-react";
import { useVoice } from "@humeai/voice-react";
import { motion, AnimatePresence } from "framer-motion";

interface HybridChatInputProps {
  onTextMessage?: (message: string) => void;
  disabled?: boolean;
}

export default function HybridChatInput({ onTextMessage, disabled }: HybridChatInputProps) {
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textMessage, setTextMessage] = useState('');
  
  const { 
    status, 
    isMuted, 
    unmute, 
    mute, 
    connect, 
    disconnect 
  } = useVoice();

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textMessage.trim()) {
      // Use the callback since Hume's voice API doesn't have sendTextMessage
      onTextMessage?.(textMessage.trim());
      setTextMessage('');
    }
  };

  const handleVoiceToggle = async () => {
    if (status.value === 'connected') {
      if (isMuted) {
        unmute();
      } else {
        mute();
      }
    } else {
      try {
        await connect?.();
        console.log('Connected to voice');
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    }
  };

  const isVoiceActive = status.value === 'connected' && !isMuted;

  return (
    <Card className="p-4 border-t border-border backdrop-blur-sm bg-background/95">
      <div className="flex items-center gap-2 mb-3">
        <Button
          variant={inputMode === 'voice' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('voice')}
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Voice
        </Button>
        <Button
          variant={inputMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('text')}
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Text
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {inputMode === 'voice' ? (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center"
          >
            <Button
              onClick={handleVoiceToggle}
              disabled={disabled}
              variant={isVoiceActive ? 'destructive' : 'default'}
              size="lg"
              className="rounded-full h-16 w-16"
            >
              {isVoiceActive ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
            <div className="ml-4 text-sm text-muted-foreground">
              {status.value === 'connected' 
                ? (isMuted ? 'Tap to unmute' : 'Speaking...') 
                : 'Tap to connect'}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleTextSubmit}
            className="flex gap-2"
          >
            <Textarea
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              placeholder="Type your message here..."
              disabled={disabled}
              className="resize-none min-h-[44px] max-h-32"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleTextSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={disabled || !textMessage.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {status.value === 'connected' && (
        <div className="flex justify-center mt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            {isVoiceActive ? 'Recording...' : 'Connected'}
          </div>
        </div>
      )}
    </Card>
  );
}