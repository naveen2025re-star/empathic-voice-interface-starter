'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Bot, BarChart3, Code, Key, AlertCircle } from 'lucide-react';

export default function BusinessDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            AI Voice Sales Bot Platform
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Create and deploy AI-powered voice sales agents that understand your business and convert visitors into customers
          </p>
        </div>

        {/* Hume Configuration Notice */}
        <div className="mb-8">
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertCircle className="h-5 w-5" />
                Voice Interface Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                To enable the AI voice interface, you'll need to configure your Hume AI credentials. 
                The business management system is fully functional without these credentials.
              </p>
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                <Key className="h-4 w-4" />
                <span>Required: HUME_API_KEY, HUME_SECRET_KEY environment variables</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Business Setup
              </CardTitle>
              <CardDescription>
                Configure your company details, products, and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Set up your business context with company information, product details, pricing, and strict conversation rules.
              </p>
              <Button asChild className="w-full">
                <Link href="/api/auth/register">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-600" />
                Voice Agent Config
              </CardTitle>
              <CardDescription>
                Create AI agents with custom personalities and rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Design voice agents that stay within your business boundaries and provide consistent, professional interactions.
              </p>
              <Button variant="outline" className="w-full">
                Configure Agent
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Track conversations and measure performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Monitor customer interactions, emotional analysis, and conversion metrics in real-time.
              </p>
              <Button variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-slate-600" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              Available endpoints for your AI voice sales bot platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Authentication</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">POST /api/auth/register</code></li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">POST /api/auth/login</code></li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">GET /api/auth/me</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Management</h4>
                <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">POST /api/business/context</code></li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">POST /api/business/voice-agent</code></li>
                  <li><code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">GET /api/business/onboarding-status</code></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}