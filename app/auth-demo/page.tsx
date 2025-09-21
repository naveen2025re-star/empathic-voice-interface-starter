"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthDemo() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleDemoSignIn = async () => {
    setIsSigningIn(true);
    
    // Create demo user session
    const demoUser = {
      id: "demo-user-123",
      email: "demo@emoticlose.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null,
    };
    
    // Store in sessionStorage for demo
    sessionStorage.setItem('demo_user', JSON.stringify(demoUser));
    
    // Simulate auth process
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Welcome to EmotiClose
            </CardTitle>
            <p className="text-gray-300">
              Experience AI-powered sales coaching with emotion analysis
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Real-time voice emotion analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">AI-powered coaching feedback</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">Performance tracking & analytics</span>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleDemoSignIn}
                disabled={isSigningIn}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                size="lg"
              >
                {isSigningIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing you in...
                  </>
                ) : (
                  <>
                    Start Your Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-400 mt-3 text-center">
                This is a demo environment. In production, you'll sign in with your Replit account.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}