"use client";

import { ArrowRight, Mic, Brain, TrendingUp, Users, CheckCircle, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { motion } from "motion/react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-20 pb-32 sm:pt-24 sm:pb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
            >
              Master Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Sales Voice
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl leading-8 text-gray-300 max-w-3xl mx-auto"
            >
              EmotiClose uses advanced AI emotion analysis to transform your sales conversations. 
              Practice with real-time feedback, perfect your pitch, and close more deals than ever before.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                onClick={() => window.location.href = '/api/login'}
              >
                Start Training Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, 0] 
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-xl"
          />
          <motion.div 
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -15, 0] 
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2 
            }}
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              AI-Powered Sales Coaching
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced emotion detection and real-time feedback to elevate your sales performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                title: "Voice Analysis",
                description: "Real-time emotion detection analyzes confidence, enthusiasm, and persuasiveness in your voice"
              },
              {
                icon: Brain,
                title: "AI Coaching",
                description: "Intelligent feedback system provides personalized tips to improve your sales conversations"
              },
              {
                icon: TrendingUp,
                title: "Performance Tracking",
                description: "Detailed analytics and progress tracking to monitor your improvement over time"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-800/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-8">
                Transform Your Sales Results
              </h2>
              
              <div className="space-y-6">
                {[
                  "Increase closing rates by up to 40%",
                  "Build unshakeable confidence in every call",
                  "Master emotional intelligence in sales",
                  "Practice risk-free with AI scenarios",
                  "Get instant, actionable feedback"
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">94%</div>
                  <div className="text-purple-300 text-lg mb-6">Success Rate Improvement</div>
                  
                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 italic">
                    "EmotiClose revolutionized my sales approach. I can actually hear myself getting better!"
                  </p>
                  <p className="text-purple-300 mt-2 font-semibold">- Sarah K., Top Sales Rep</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Close More Deals?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of sales professionals who are already using EmotiClose to boost their performance.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            
            <p className="text-gray-400 mt-4">No credit card required • Start practicing in 30 seconds</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}